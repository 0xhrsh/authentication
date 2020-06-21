module.exports = (client_id, claims) => {
    console.log(claims.join(','))
    return `<html>
        <head>
            <title>Login</title>
        </head>

        <body>
            <form action="/authEP" method="post">
                <p>
                    <b>${client_id}</b> wants access to access your
                </p>
                <p>
                    <b>${claims.join(', ')}</b>
                </p>
                <br>
                Username: <input type="text" value="beta.1" name="username" id="username">
                <br>
                Password: <input type="password" value="1234" name="password" id="password">
                <br>
                <input type="hidden" name="client_id" id="client_id" value="${client_id}">
                <input type="hidden" name="claims" id="claims" value="${claims.join(',')}">
                <input type="submit" value="submit">
            </form>
        </body>
    </html>`
}