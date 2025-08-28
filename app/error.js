"use client";

export default function Error({ error, reset }) {
    return (
        <html>
            <body>
                <h2>Bir hata oluştu!</h2>
                <p>{error.message}</p>
                <button onClick={() => reset()}>Tekrar dene</button>
            </body>
        </html>
    );
}
