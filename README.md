# Demonstration of how cross-origin requests and csrf-tokens work

Start containers:
  * Run the "same-origin" docker container: `$ ./run.sh`
  * Run the "cross-origin" docker container: `$ ./run.sh console-logging-server-xorigin 8000`

To demonstrate that same-origin access works, enter in browser:
  * `http://localhost:3000/load_and_submit_form_with_fetch.html`
  * `http://localhost:3000/load_form_into_iframe.html`
  * `http://localhost:3000/load_form_into_iframe_no_embedding.html`
  * `http://localhost:3000/jquery_run_and_try_to_load_source.html`  

 
To demonstrate that cross-origin access will not work, enter in browser:
  * `http://localhost:8000/load_and_submit_form_with_fetch.html`
  * `http://localhost:8000/load_form_into_iframe.html`
     * Note: We can load the form with the csrf token into the iframe, and the user can submit the form successfully. However, our javascript cannot access or modify the contents of the form
  * `http://localhost:8000/load_form_into_iframe_no_embedding.html`
     * Note: with these headers, the browser will not allow the cross-origin form to be embedded in an iframe at all
  * `http://localhost:8000/jquery_run_and_try_to_load_source.html`  
     * Note: `<script>` tags can always be executed cross-origin, but we cannot inspect the source cross-origin.

[wireshark](https://wireshark.org "wireshark homepage") can be used to show that cross-origin requests are sent to the server and the responses are returned from the server to the browser. However, if CORS is not enabled on the server endpoint, the browser will block the relevant html or js code from reading the information returned from the server. 

