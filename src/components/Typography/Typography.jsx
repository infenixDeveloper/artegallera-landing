import React from "react";

const Typography = ({
  variant = "p",
  children,
  className,
  style,
  ...props
}) => {
  const Tag = variant;

  return (
    <Tag className={className} style={style} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
