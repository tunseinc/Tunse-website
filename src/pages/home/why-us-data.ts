import ReliabilityIcon from "../../components/Icons/ReliabilityIcon";
import IntegrityIcon from "../../components/Icons/IntegrityIcon";
import EfficiencyIcon from "../../components/Icons/EfficiencyIcon";
import DignityIcon from "../../components/Icons/DignityIcon";
import Call2actIcon from "../../components/Icons/Call2actIcon";
import LogoIconLight from "../../components/Icons/LogoIconLight";
// import StarIcon from "../../components/Icons/StarIcon";
// import Button from "../../components/Form/Button";
// import Modal from "../../components/Modal";
// import Input from "../../components/Form/Input";
// import Select from "../../components/Form/Select";


export const whyUsData = {
    sectionTitle: "Why Us",
    features: [
      {
        id: 1,
        title: "Reliability",
        description: "This is one of the core values at Tunse, you can trust us to always deliver!",
        Icon: ReliabilityIcon
      },
      {
        id: 2,
        title: "Integrity",
        description: "Our word is our bond! If we say we will deliver, we will at all cost.",
        Icon: IntegrityIcon
      },
      {
        id: 3,
        title: "Efficiency",
        description: "Timeliness, a value as old as time itself and valuable as money is at the fore-front of our services",
        Icon: EfficiencyIcon
      },
      {
        id: 4,
        title: "Dignity",
        description: "We all at the core of our being desire to be cherished, respected and dignified as royals. With tunse, you are one.",
        Icon: DignityIcon
      }
    ],
    callToAction: {
      title: "Get the app now!\nYou click it! we fix it!",
      description: "It only takes a minute to start benefiting the goodness of our one click fix solution!",
      Icon: Call2actIcon,
      buttonText: "Get Started",
      
    },
  };

  export const footer = {
    logo: LogoIconLight,
        links: [
          {
            id: 1,
            text: "Instagram",
            url: "https://instagram.com/tunse_inc",
            external: true
          },
          {
            id: 2,
            text: "Twitter",
            url: "https://twitter.com/tunse_inc",
            external: true
          },
          {
            id: 3,
            text: "Contact",
            url: "mailto:info@tunse.tech",
            external: true
          },
          {
            id: 4,
            text: "Legal",
            url: "mailto:info@tunse.tech",
            external: true
          },
          {
            id: 5,
            text: "Terms and Conditions",
            url: "/terms",
            external: false
          },
          {
            id: 6,
            text: "Privacy Policy",
            url: "/privacy-policy",
            external: false
          }
        ]
  }