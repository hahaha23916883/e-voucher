import React, { useEffect, useState } from "react";
import "../index.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Voucher from "./Voucher";
import VoucherDetail from "./VoucherDetail";
import UsedVoucherDetail from "./UsedVoucherDetail"
import axios from "axios";

export default function App() {
  const [detailTarget, setDetailTarget] = useState("");
  const [voucherData, setVoucherData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [QR, setQR] = useState("");
  const [QRKey, setQRKey] = useState("");
  const [stateData, setStateData] = useState(1);
  const [shareQr, setShareQr] = useState("")

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

// 已綁定票券 直接使用
function useYourVoucher(id) {
  setDetailTarget(voucherData[id]);
    listType = "UseQr";
      var product_num = voucherData[id].product_num;
      var deadline = voucherData[id].deadline;
      axios
        .get(
          `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&product_num=${product_num}&deadline=${deadline}&list_type=${listType}&type=e_ticket&get_key=true`
        )
        .then((response) => {
          setDetail(response.data);
          setQRKey(response.data[0].key_url);
        })
}

// useEffect(() => {console.log(detailTarget);}, [detailTarget])

// 使用票券 獲取keyurl
function clickToUse() {
    document.querySelector(".QRcode").style.display = "block";
    document.querySelector(".useBtn").style.display = "none";
    document.querySelector(".comfirmBtn").style.display = "none";
    listType = "UseQr";
      var product_num = detailTarget.product_num;
      var deadline = detailTarget.deadline;
      axios
        .get(
          `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&product_num=${product_num}&deadline=${deadline}&list_type=${listType}&type=e_ticket`
        )
        .then((response) => {
          setDetail(response.data);
          setQRKey(response.data[0].key_url);
        })
  }
// 偵測detail有改變 刷新
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
}, [detail])

  function cancelDetailPage() {
    setDetailTarget("");
    setDetail([]);
    setQRKey("");      
  }

  // 點擊轉送複製share-qr
useEffect(()=> {
  listType = "ShareETicket";
      var product_num = detailTarget.product_num;
      var deadline = detailTarget.deadline;
      axios
        .get(
          `https://www.flashfalcon.net/product_transaction_list_api/?uid=${uid}&bot_sid=${botSid}&product_num=${product_num}&deadline=${deadline}&list_type=${listType}&type=e_ticket`
        )
        .then((response) => {
          setShareQr(response.data[0].key_url);
        })
}, [detailTarget])

  function clickToShare() {
    console.log(shareQr);
    navigator.clipboard.writeText(shareQr);
    setDetailTarget("");
    setDetail([]);
    setQRKey(""); 
  }

  // 回傳keyurl確認票券使用狀態
  const sendDataToAPI = () => {
    const requestData = { key: QRKey }; // 要傳遞給API的資料
    var product_num = detailTarget.product_num;
    var deadline = detailTarget.deadline;
    axios
      .post(
        `https://www.flashfalcon.net/product_transaction_list_api/?list_type=UseQr&product_num=${product_num}&deadline=${deadline}&type=e_ticket`,
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
// console.log(voucherData);
  return (
    <div className="body">
      <header>我的兌換券</header>
      <Tabs>
        <TabList>
          <Tab>未綁定</Tab>
          <Tab>已綁定</Tab>
        </TabList>
        <TabPanel>
        {stateData === 1 && detailTarget && (
        <VoucherDetail
          title={detailTarget.product_name}
          deadline={detailTarget.deadline}
          amount={detailTarget.Amount}
          QR={QR}
          QRKey={QRKey}
          cancelDetailPage={cancelDetailPage}
          clickToUse={clickToUse}
          clickToShare={clickToShare}
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
          if (content.get_key === false) {
    return (
      <Voucher
        key={index}
        id={index}
        title={content.product_name}
        deadline={content.deadline}
        amount={content.Amount}
        clickLearnMore={clickLearnMore}
        useYourVoucher={useYourVoucher}
        getKey={content.get_key}
      />
    );
  } else {
    return null; 
  }
        })}
      </div>
      </TabPanel>
        <TabPanel>
        {stateData === 1 && detailTarget && (
        <UsedVoucherDetail
          title={detailTarget.product_name}
          deadline={detailTarget.deadline}
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
          if (content.get_key === true) {
    return (
      <Voucher
        key={index}
        id={index}
        title={content.product_name}
        deadline={content.deadline}
        amount={content.Amount}
        clickLearnMore={clickLearnMore}
        useYourVoucher={useYourVoucher}
        getKey={content.get_key}
      />
    );
  } else {
    return null; 
  }
        })}
      </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
