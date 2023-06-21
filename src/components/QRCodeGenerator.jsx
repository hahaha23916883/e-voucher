import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRCodeComponent(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    QRCode.toCanvas(canvas, props.text, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }, [props.text]);
  console.log(props.text);
  return <canvas className="QRcode" ref={canvasRef} />;
}
