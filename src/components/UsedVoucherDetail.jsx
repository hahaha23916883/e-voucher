import React, { useEffect } from "react";
import QRCodeGenerator from "./QRCodeGenerator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function VoucherDetail(props) {
    useEffect(() => {
        document.querySelector(".QRcode").style.display = "block";
    },[])
    const qrCodeValue = props.QRKey
    return (
    <div className="popover-bg">
        <div className="popover-page">
        <h3>使用電子兌換券</h3>
        <h5>- {props.title} -</h5>
        <p className="popover-content">
          確認兌換後此兌換卷將被綁定，無法再進行轉手或其他交易行為。確定要使用按下下方"確認兌換"即可使用。
        </p>
        <QRCodeGenerator text={qrCodeValue} />
        <div className="cancel-icon" onClick={props.cancelDetailPage}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        </div>
    </div>)
}