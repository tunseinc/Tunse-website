import PrivacyDoc from '../../assets/pdfs/privacy_policy.pdf'

const Privacy = () => {

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src={PrivacyDoc}
        title="privacy-policy"
        style={{ width: "100%", height: "100vh", border: "none" }}
        id="pdfEmbed"
      />
    </div>
  )
}

export default Privacy