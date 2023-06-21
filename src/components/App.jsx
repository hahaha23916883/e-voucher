import React, { useEffect, useState } from "react";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Voucher from "./Voucher";
import VoucherDetail from "./VoucherDetail";
import axios from "axios";

export default function App() {
  const [detailTarget, setDetailTarget] = useState("");
  const [voucherData, setVoucherData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [QR, setQR] = useState("");
  const [QRKey, setQRKey] = useState("");
  const [stateData, setStateData] = useState(1);

  const params = new URLSearchParams(window.location.search);
  const botSid = params.get("bot_sid");
  const uid = params.get("uid");
  var listType = params.get("list_type");

  useEffect(() => {
    listType = "amount";
    axios
      .get(
        `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&list_type=${listType}&type=e_ticket`
      )
      .then((response) => {
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function clickLearnMore(id) {
    setDetailTarget(voucherData[id]);
  }

  useEffect(() => {
    let interval;
    if (detailTarget !== "") {
      listType = "UseQr";
      var product_num = detailTarget.product_num;
      var deadline = detailTarget.deadline;
      axios
        .get(
          `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&product_num=${product_num}&deadline=${deadline}&list_type=${listType}&type=e_ticket`
        )
        .then((response) => {
          setDetail(response.data);
          setQR(response.data[0].qr_url);
          setQRKey(response.data[0].key_url);

          // 倒數30秒換QR
          interval = setInterval(() => {
            axios
              .get(
                `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&product_num=${product_num}&deadline=${deadline}&list_type=${listType}&type=e_ticket`
              )
              .then((response) => {
                setQR(response.data[0].qr_url);
              })
              .catch((error) => {
                console.error(error);
              });
          }, 30000);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return () => clearInterval(interval);
  }, [detailTarget]);

  function cancelDetailPage() {
    setDetailTarget("");
    setDetail([]);
    setQRKey("");
  }

  // 回傳keyurl確認票券使用狀態
  const sendDataToAPI = () => {
    const requestData = { key: QRKey }; // 要傳遞給API的資料
    axios
      .post(
        "https://www.flashfalcon.net/product_transaction_list_api/?list_type=UseQr&product_num=family50&deadline=2023-6-8 18:00&type=e_ticket",
        requestData
      )
      .then((response) => {
        // 處理API回傳的資料
        setStateData(response.data[0].state);
      })
      .catch((error) => {
        // 處理錯誤
        console.error(error);
      });
  };

  useEffect(() => {
    if (QRKey) {
      // 啟動定時器，每10秒執行一次 sendDataToAPI 函式
      const interval = setInterval(sendDataToAPI, 10000);

      // 在組件卸載時清除定時器
      return () => clearInterval(interval);
    }
  }, [QRKey]);

  // 確認state如果已使用重新刷新list
  useEffect(() => {
    listType = "amount";
    axios
      .get(
        `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&list_type=${listType}&type=e_ticket`
      )
      .then((response) => {
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [stateData]);

  return (
    <div>
      <header>我的兌換券</header>
      {stateData === 1 && detail?.length > 0 && detailTarget && (
        <VoucherDetail
          title={detailTarget.product_name}
          deadline={detail[0].deadline}
          content={detail[0].content}
          amount={detailTarget.Amount}
          QR={QR}
          QRKey={QRKey}
          cancelDetailPage={cancelDetailPage}
        />
      )}

      {stateData === 0 && detail?.length > 0 && detailTarget && (
        <div className="popover-bg">
          <div className="popover-page">
            <div className="cancel-icon" onClick={cancelDetailPage}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
            <h3 className="success-text">兌換成功</h3>
          </div>
        </div>
      )}
      <div className="voucher-list">
        {voucherData.map((content, index) => {
          return (
            <Voucher
              key={index}
              id={index}
              title={content.product_name}
              deadline={content.deadline}
              amount={content.Amount}
              clickLearnMore={clickLearnMore}
            />
          );
        })}
      </div>
    </div>
  );
}
