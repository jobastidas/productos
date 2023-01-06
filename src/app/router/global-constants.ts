import { HttpHeaders } from '@angular/common/http';

export class GlobalConstants {
    public static apiURL: string = "https://prueba-tecnica-idecide.azurewebsites.net/api";

    public static createRequestOptions(usuario) {
        let headers = new HttpHeaders({
            "x-token": usuario,
        });
        return headers;
    }
}