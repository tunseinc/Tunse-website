import useDocumentHead from "../../hooks/use-document-head";

const VerificationLinkExpired = () => {
 useDocumentHead({ title: "Session Expired" });
    return (
        <div className="w-full">
            <h1 className="text-red-500 text-center p-5 border-b border-red-500">Verification Link has expired</h1>
        </div>
    )
}

export default VerificationLinkExpired