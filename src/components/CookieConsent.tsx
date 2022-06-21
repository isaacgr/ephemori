import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";

declare var window: EventTarget;
declare var document: Document;

type Props = {
  componentType?: "Dialog" | "Snackbar";
  cookieName: string;
  cookieValue: string;
  acceptOnScroll?: boolean;
  acceptOnScrollPercentage?: number;
  onAccept?: () => void | null;
  expires?: number | Date;
  hideOnAccept?: boolean;
  children?: React.ReactElement<any, any>;
  title?: string | null;
  message?: string;
  acceptButtonLabel?: string;
  debug?: boolean;
  extraCookieOptions?: any;
  snackbarAnchor?: {
    horizontal: "left" | "center" | "right";
    vertical: "top" | "bottom";
  };
  actions?: React.ReactNode;
};

/**
 * This component is the CookieConsent it pops a Snackbarinforming the user about cookie consent.
 */
const CookieConsent = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const {
    componentType,
    children,
    message,
    snackbarAnchor,
    title,
    acceptButtonLabel,
    actions,
    onAccept
  } = props;

  useEffect(() => {
    const { cookieName, debug, acceptOnScroll } = props;

    if (Cookies.get(cookieName) === undefined || debug) {
      setVisible(true);
    } else {
      if (onAccept) {
        onAccept();
      }
    }

    if (window && acceptOnScroll) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (window) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  /**
   * checks whether scroll has exceeded set amount and fire accept if so.
   */
  const handleScroll = () => {
    const { acceptOnScrollPercentage } = props;
    if (document && typeof acceptOnScrollPercentage === "number") {
      const rootNode = document.documentElement || document.body;

      if (rootNode) {
        // (top / (height - height)) * 100
        const percentage =
          (rootNode.scrollTop /
            (rootNode.scrollHeight - rootNode.clientHeight)) *
          100;

        if (percentage > acceptOnScrollPercentage) {
          handleAccept();
        }
      }
    }
  };

  /**
   * Set a persistent cookie
   */
  const handleAccept = () => {
    const {
      cookieName,
      cookieValue,
      expires,
      hideOnAccept,
      onAccept,
      extraCookieOptions
    } = props;

    if (onAccept) {
      onAccept();
    }

    if (window) {
      window.removeEventListener("scroll", handleScroll);
    }

    Cookies.set(cookieName, cookieValue, { expires, ...extraCookieOptions });

    if (hideOnAccept) {
      setVisible(false);
    }
  };

  // const childrenWithProps = React.Children.map(children, (child) => {
  //   if (!React.isValidElement(child)) {
  //     return React.cloneElement(child as React.ReactElement<any, any>, {
  //       cookiesAccepted: visible
  //     });
  //   } else {
  //     return child as React.ReactElement<any, any>;
  //   }
  // });

  return (
    <Snackbar
      anchorOrigin={snackbarAnchor}
      open={visible}
      message={<span id="message-id">{message}</span>}
      action={[
        ...React.Children.toArray(actions),
        <Button
          key="accept"
          color="secondary"
          size="small"
          onClick={handleAccept}
        >
          {acceptButtonLabel}
        </Button>
      ]}
    />
  );
};

CookieConsent.defaultProps = {
  componentType: "Snackbar",
  cookieValue: "",
  acceptOnScroll: false,
  acceptOnScrollPercentage: 25,
  expires: 365,
  hideOnAccept: true,
  debug: false,
  extraCookiesOptions: undefined,
  snackbarAnchor: { horizontal: "center", vertical: "bottom" },
  children: null,
  message:
    "By clicking 'Accept', you agree to the storing of cookies on your device to enable webpage functionality",
  title: null,
  acceptButtonLabel: "Accept",
  actions: null
};

export default CookieConsent;
