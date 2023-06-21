import React, { useState, useEffect, useRef } from "react";
import QRCodeGenerator from "./QRCodeGenerator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function VoucherDetail(props) {
  function clickToComfirm() {
    document.querySelector(".popover-comfirm-page").style.display = "flex";
    document.querySelector(".popover-use-page").style.display = "none";
  }

  function clickToUse() {
    document.querySelector(".QRcode").style.display = "block";
    document.querySelector(".useBtn").style.display = "none";
    document.querySelector(".comfirmBtn").style.display = "none";
  }

  // 生成QRcode
  const qrCodeValue = props.QRKey; // 要生成QR码的文本或链接

  // // 倒數30秒
  // const [seconds, setSeconds] = useState(30);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setSeconds((prevSeconds) => prevSeconds - 1);
  //   }, 1000);

  //   if (seconds === 0) {
  //     clearInterval(timer);
  //   }

  //   return () => clearInterval(timer);
  // }, [seconds]);

  // // 當QR改變重製30秒
  // useEffect(() => {
  //   setSeconds(30); // 重置秒数为30
  // }, [qrCodeValue]);

  return (
    <div className="popover-bg">
      <div className="popover-page popover-use-page">
        <h3>{props.title}</h3>
        <div className="popover-info">
          <p>兌換期限 : {props.deadline}</p>
          <p>擁有數量 : {props.amount}張</p>
        </div>
        <p className="popover-content">{props.content}</p>
        <button className="voucher-btn useBtn" onClick={clickToComfirm}>
          點我兌換
        </button>
        <div className="cancel-icon" onClick={props.cancelDetailPage}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      <div className="popover-comfirm-page popover-page">
        <h3>確定要使用</h3>
        <h5>- {props.title} -</h5>
        <p className="popover-content">
          確認兌換後此兌換卷將被綁定，無法再進行轉手或其他交易行為。確定要使用按下下方"確認兌換"即可使用。
        </p>
        <QRCodeGenerator text={qrCodeValue} />
        {/* <QRCode className="QRcode" value={qrCodeValue} /> */}
        {/* <div>{seconds} 秒</div> */}
        <button className="voucher-btn useBtn comfirmBtn" onClick={clickToUse}>
          確定兌換
        </button>
        <div className="cancel-icon" onClick={props.cancelDetailPage}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
}
