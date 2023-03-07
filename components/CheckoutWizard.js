import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="shpping">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <div
            key={step}
            className={`
       ${index <= activeStep ? "activeStep" : "inprogressStep"}
          
       `}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
