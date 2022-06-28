import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import gridPageImage from "../images/grid_page.png";

const AboutSection = ({ divClass }) => {
  return (
    <div className={divClass}>
      <div className="about-section content-block">
        <Typography variant="h4">About ephemori</Typography>
        <br />
        <Typography variant="body1">
          This website initially started as my own personal webpage. My father
          passed away in October 2020, and it forced me to think about life and
          death a lot more than I had before. I thought about how distant many
          past events in my life were; high school seemed like only a few years
          ago, yet two of my good friends who I had grown up with just had kids.
          It had been 4 years since university and 6 years (6 years!?) since
          college. I was coming up on the 5 year mark with my current job. I met
          my wife when I started, but it still seemed like we were still getting
          to know each other, and I knew that there was still so much left to
          experience.
        </Typography>
        <br />
        <Typography variant="body1">
          I wanted a way to visualize how much of my life had passed so far and
          to highlight some meaningful events that had occurred in that time. In
          a way, it was about reflecting on the impending end of my life --- a
          sort of graphic representation of "memento mori", meaning "remember
          death", a saying which the Stoics would meditate on.
        </Typography>
        <br />
        <Typography variant="body1">
          I had seen some concepts online where a large poster paper with a grid
          on it was filled in and where each block in the grid represented one
          week of the year.
        </Typography>
        <br />
        <Typography variant="body1">
          I used this grid concept and expanded on it to include highlighted
          "points of reflection". These points were significant dates in my life
          (first job, when I graduated, met my wife etc.) and highlighting them
          on the grid allowed me to use these moments in time to reflect on the
          present.
        </Typography>
        <br />
        <Typography variant="body1">
          The grid gave me a unique view to see how much time had passed since
          those dates. I used it to think about where I am now and what I had
          achieved since each of those highlighted points. It also forced me to
          think about how my time was being spent. Was I focusing on the right
          things? Was this week meaningful? This year?
        </Typography>
        <br />
        <Typography variant="body1">
          In using this app I hope that you are able to gain a similar level of
          introspection on yourself and to put into perspective just how short
          the time we have is.
        </Typography>
      </div>
      <div className="content-block">
        <Divider />
      </div>
      <div className="about-section content-block">
        <Typography variant="h5">
          "While we wait for life, life passes"
        </Typography>
        <Typography variant="caption">- Seneca -</Typography>
      </div>
      <div className="about-section content-block">
        <Typography variant="subtitle1">
          Below is an example of what you can build and visualize with this app
        </Typography>
        <br />
        <img style={{ maxWidth: "90%" }} src={gridPageImage} />
      </div>
    </div>
  );
};

export default AboutSection;
