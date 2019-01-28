import React from "react";

// ovo je isto kao da se kaze (props.input) => {}  ....
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      {/* label je ovde isto sto i props.label, ali zbog destrukturinga se ovako
      skrati */}
      <label>{label}</label>
      {/* ovako smo mu preneli sve ima sto objekat props.input, npr props.input.onBlur lii props.input.onChange */}
      <input {...input} style={{ marginBottom: "5px" }} />
      <div className="red-text" style={{ marginBottom: "20px" }}>
        {/* ES2016... touched je bulijan, ako je on istinit onda se prikazuje error, u suprotnom se ne prikazuje */}
        {touched && error}
      </div>
    </div>
  );
};
