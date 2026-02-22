import React from "react";

const ContentWrapper = ({ children }: React.PropsWithChildren): React.ReactElement => {
    return (
        <div className="content-wrapper">
            {children}
        </div>
    );
};

export default ContentWrapper;