import TermsDoc from '../../assets/pdfs/terms.pdf'


const TermsAndConditions = () => {

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
                src={TermsDoc}
                title={"terms-and-condition"}
                style={{ width: "100%", height: "100vh", border: "none" }}
            />
        </div>
    )
}

export default TermsAndConditions