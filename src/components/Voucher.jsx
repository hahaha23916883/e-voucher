import React from "react";

export default function Voucher(props) {
  return (
    <div className="voucher">
      <div className="voucher-title">
        <h3>{props.title}</h3>
        <div className="voucher-content">
          <p>兌換期限 : {props.deadline}</p>
          <p>擁有數量 : {props.amount}張</p>
        </div>
      </div>
      <button
      className="voucher-btn"
      onClick={props.getKey ? () => props.useYourVoucher(props.id) : () => props.clickLearnMore(props.id)}
      >
        {props.getKey ? '點我兌換' : '兌換/轉送'}
      </button>
    </div>
  );
}
