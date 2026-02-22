export type kapcsolatObj = {
    kep: Array<{ src: string, title?: string }>,
    nev: string,
    cim: string,
    telefon: string,
    email: string,
    kapcsolatcim: string,
    kapcsolatleiras: string,
}

export type emailObj = {
    ok?: string,
    nev?: string,
    email?: string,
    telefon?: string,
    uzenet?: string,
    toEmail?: string,
}