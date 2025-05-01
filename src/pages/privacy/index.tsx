import PrivacyDoc from '../../assets/pdfs/privacy_policy.pdf'

const Privacy = () => {
  return (
    <iframe src={PrivacyDoc} title={"privacy-policy"} className={"policy"} width={"100%"} height={"900px"}></iframe>
  )
}

export default Privacy