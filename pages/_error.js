// Geçici çözüm - Next.js 15 bug'ı için
export default function Error({ statusCode }) {
    return (
        <div>
            <h1>
                {statusCode
                    ? `A ${statusCode} error occurred on server`
                    : 'An error occurred on client'}
            </h1>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}
