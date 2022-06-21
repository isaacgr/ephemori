import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const CookiePolicy = () => {
  return (
    <div className="container">
      <Typography variant="h3">Cookie Policy for ephemori</Typography>
      <Typography paragraph={true}>
        This is the Cookie Policy for ephemori, accessible from www.ephemori.com
      </Typography>
      <Typography variant="h4">What Are Cookies</Typography>
      <Typography paragraph={true}>
        As is common practice with almost all professional websites this site
        uses cookies, which are tiny files that are downloaded to your computer,
        to improve your experience. This page describes what information they
        gather, how we use it and why we sometimes need to store these cookies.
        We will also share how you can prevent these cookies from being stored
        however this may downgrade or 'break' certain elements of the sites
        functionality.
      </Typography>
      <Typography variant="h4">How We Use Cookies</Typography>
      <Typography paragraph={true}>
        We use cookies for a variety of reasons detailed below. Unfortunately in
        most cases there are no industry standard options for disabling cookies
        without completely disabling the functionality and features they add to
        this site. It is recommended that you leave on all cookies if you are
        not sure whether you need them or not in case they are used to provide a
        service that you use.
      </Typography>
      <Typography variant="h4">Disabling Cookies</Typography>
      <Typography paragraph={true}>
        You can prevent the setting of cookies by adjusting the settings on your
        browser (see your browser Help for how to do this). Be aware that
        disabling cookies will affect the functionality of this and many other
        websites that you visit. Disabling cookies will usually result in also
        disabling certain functionality and features of the this site. Therefore
        it is recommended that you do not disable cookies. This Cookies Policy
        was created with the help of the{" "}
        <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/">
          Cookies Policy Generator
        </a>
        .
      </Typography>
      <Typography variant="h4">The Cookies We Set</Typography>
      <List>
        <ListItem>
          <Typography paragraph={true}>Account related cookies</Typography>
          <Typography paragraph={true}>
            If you create an account with us then we will use cookies for the
            management of the signup process and general administration. These
            cookies will usually be deleted when you log out however in some
            cases they may remain afterwards to remember your site preferences
            when logged out.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography paragraph={true}>Login related cookies</Typography>
          <Typography paragraph={true}>
            We use cookies when you are logged in so that we can remember this
            fact. This prevents you from having to log in every single time you
            visit a new page. These cookies are typically removed or cleared
            when you log out to ensure that you can only access restricted
            features and areas when logged in.
          </Typography>
        </ListItem>
      </List>
      <Typography variant="h4">Third Party Cookies</Typography>
      <Typography paragraph={true}>
        In some special cases we also use cookies provided by trusted third
        parties. The following section details which third party cookies you
        might encounter through this site.
      </Typography>
      <List>
        <ListItem>
          <Typography paragraph={true}>
            From time to time we test new features and make subtle changes to
            the way that the site is delivered. When we are still testing new
            features these cookies may be used to ensure that you receive a
            consistent experience whilst on the site whilst ensuring we
            understand which optimisations our users appreciate the most.
          </Typography>
        </ListItem>
      </List>
      <Typography variant="h4">More Information</Typography>
      <Typography paragraph={true}>
        Hopefully that has clarified things for you and as was previously
        mentioned if there is something that you aren't sure whether you need or
        not it's usually safer to leave cookies enabled in case it does interact
        with one of the features you use on our site.
      </Typography>
      <Typography paragraph={true}>
        For more general information on cookies, please read{" "}
        <a href="https://www.cookiepolicygenerator.com/sample-cookies-policy/">
          the Cookies Policy article
        </a>
        .
      </Typography>
      <Typography paragraph={true}>
        However if you are still looking for more information then you can
        contact us through one of our preferred contact methods:
      </Typography>
      <List>
        <ListItem>Email: admin@ephemori.com</ListItem>
      </List>
    </div>
  );
};

export default CookiePolicy;
