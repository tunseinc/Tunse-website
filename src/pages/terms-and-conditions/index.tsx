import TermsDoc from '../../assets/pdfs/terms.pdf'


const TermsAndConditions = () => {
    return (
        <iframe
            src={TermsDoc}
            title={"terms-and-condition"}
            className={"policy"}
            width={"100%"}
            height={"900px"}
        />
    )
}

export default TermsAndConditions