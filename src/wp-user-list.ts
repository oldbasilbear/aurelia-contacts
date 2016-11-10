import { inject } from 'aurelia-framework';

/**
 * HttpClient test - START
 */
import { HttpClient } from 'aurelia-fetch-client';

/**
 * HttpClient test - END
 */

@inject(HttpClient)
export class WpUserList {
    users : string[];
    selectedId = 0;

                    constructor(private http: HttpClient) {
        this.http = http;
    }

    created() {
        this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php')
        .then(response => response.json())
          .then(data => {
               this.users = data;
          });
    }

    select(user) {
        this.selectedId = user.id;
        return true;
    }
}