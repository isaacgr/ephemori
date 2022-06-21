import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <Typography variant="h3">Privacy Policy for ephemori</Typography>

      <Typography paragraph={true}>
        At ephemori, accessible from www.ephemori.com, one of our main
        priorities is the privacy of our visitors. This Privacy Policy document
        contains types of information that is collected and recorded by ephemori
        and how we use it.
      </Typography>

      <Typography paragraph={true}>
        If you have additional questions or require more information about our
        Privacy Policy, do not hesitate to contact us. Our Privacy Policy was
        generated with the help of{" "}
        <a href="https://www.gdprprivacynotice.com/">
          GDPR Privacy Policy Generator
        </a>
      </Typography>

      <Typography variant="h4">
        General Data Protection Regulation (GDPR)
      </Typography>
      <Typography paragraph={true}>
        We are a Data Controller of your information.
      </Typography>

      <Typography paragraph={true}>
        ephemori legal basis for collecting and using the personal information
        described in this Privacy Policy depends on the Personal Information we
        collect and the specific context in which we collect the information:
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            ephemori needs to perform a contract with you
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            You have given ephemori permission to do so
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Processing your personal information is in ephemori legitimate
            interests
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>ephemori needs to comply with the law</ListItemText>
        </ListItem>
      </List>

      <Typography paragraph={true}>
        ephemori will retain your personal information only for as long as is
        necessary for the purposes set out in this Privacy Policy. We will
        retain and use your information to the extent necessary to comply with
        our legal obligations, resolve disputes, and enforce our policies.
      </Typography>

      <Typography paragraph={true}>
        If you are a resident of the European Economic Area (EEA), you have
        certain data protection rights. If you wish to be informed what Personal
        Information we hold about you and if you want it to be removed from our
        systems, please contact us.
      </Typography>
      <Typography paragraph={true}>
        In certain circumstances, you have the following data protection rights:
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            The right to access, update or to delete the information we have on
            you.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>The right of rectification.</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>The right to object.</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>The right of restriction.</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>The right to data portability</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>The right to withdraw consent</ListItemText>
        </ListItem>
      </List>

      <Typography variant="h4">Log Files</Typography>

      <Typography paragraph={true}>
        ephemori follows a standard procedure of using log files. These files
        log visitors when they visit websites. All hosting companies do this and
        a part of hosting services' analytics. The information collected by log
        files include internet protocol (IP) addresses, browser type, Internet
        Service Provider (ISP), date and time stamp, referring/exit pages, and
        possibly the number of clicks. These are not linked to any information
        that is personally identifiable. The purpose of the information is for
        analyzing trends, administering the site, tracking users' movement on
        the website, and gathering demographic information.
      </Typography>

      <Typography variant="h4">Cookies and Web Beacons</Typography>

      <Typography paragraph={true}>
        Like any other website, ephemori uses 'cookies'. These cookies are used
        to store information including visitors' preferences, and the pages on
        the website that the visitor accessed or visited. The information is
        used to optimize the users' experience by customizing our web page
        content based on visitors' browser type and/or other information.
      </Typography>

      <Typography variant="h4">Privacy Policies</Typography>

      <Typography paragraph={true}>
        You may consult this list to find the Privacy Policy for each of the
        advertising partners of ephemori.
      </Typography>

      <Typography paragraph={true}>
        Third-party ad servers or ad networks uses technologies like cookies,
        JavaScript, or Web Beacons that are used in their respective
        advertisements and links that appear on ephemori, which are sent
        directly to users' browser. They automatically receive your IP address
        when this occurs. These technologies are used to measure the
        effectiveness of their advertising campaigns and/or to personalize the
        advertising content that you see on websites that you visit.
      </Typography>

      <Typography paragraph={true}>
        Note that ephemori has no access to or control over these cookies that
        are used by third-party advertisers.
      </Typography>

      <Typography variant="h4">Third Party Privacy Policies</Typography>

      <Typography paragraph={true}>
        ephemori's Privacy Policy does not apply to other advertisers or
        websites. Thus, we are advising you to consult the respective Privacy
        Policies of these third-party ad servers for more detailed information.
        It may include their practices and instructions about how to opt-out of
        certain options.{" "}
      </Typography>

      <Typography paragraph={true}>
        You can choose to disable cookies through your individual browser
        options. To know more detailed information about cookie management with
        specific web browsers, it can be found at the browsers' respective
        websites.
      </Typography>

      <Typography variant="h4">Children's Information</Typography>

      <Typography paragraph={true}>
        Another part of our priority is adding protection for children while
        using the internet. We encourage parents and guardians to observe,
        participate in, and/or monitor and guide their online activity.
      </Typography>

      <Typography paragraph={true}>
        ephemori does not knowingly collect any Personal Identifiable
        Information from children under the age of 13. If you think that your
        child provided this kind of information on our website, we strongly
        encourage you to contact us immediately and we will do our best efforts
        to promptly remove such information from our records.
      </Typography>

      <Typography variant="h4">Online Privacy Policy Only</Typography>

      <Typography paragraph={true}>
        Our Privacy Policy applies only to our online activities and is valid
        for visitors to our website with regards to the information that they
        shared and/or collect in ephemori. This policy is not applicable to any
        information collected offline or via channels other than this website.
      </Typography>

      <Typography variant="h4">Consent</Typography>

      <Typography paragraph={true}>
        By using our website, you hereby consent to our Privacy Policy and agree
        to its terms.
      </Typography>
    </div>
  );
};

export default PrivacyPolicy;
