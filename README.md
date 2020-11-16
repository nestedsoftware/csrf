# Demonstration of how cross-origin requests and csrf-tokens work

The examples below show how the browser's [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy "same-origin policy") can prevent undesired cross-origin access to resources. It's important to understand that the browser enforces this policy on browser "reads", that is, on the responses sent back from the server to the browser. 

These examples also show how an unguessable csrf token bound to the user's session can prevent cross-origin form submissions from succeeding (make sure to refresh the csrf token whenever the user logs back into the application). In such cases, the form is actually submitted, along with the relevant authorization cookies, but there should be no way for a third-party to access the secret csrf token or to programmatically tamper with the user's form fields (also see [clickjacking](https://en.wikipedia.org/wiki/Clickjacking#:~:text=Clickjacking%20(classified%20as%20a%20User,control%20of%20their%20computer%20while "clickjacking")).

In addition the what is shown in the examples below, when possible, it is a good idea to make cookies [secure and httponly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Creating_cookies "secure and httponly cookies"). Also (unrelated to this demo), remember to [sanitize web inputs](https://kevinsmith.io/sanitize-your-inputs "sanitize your inputs").

Start containers:
  * Run the "same-origin" docker container: `$ ./run.sh`
  * Run the "cross-origin" docker container: `$ ./run.sh console-logging-server-xorigin 8000`

To demonstrate that same-origin access works, enter the following into the browser's address field (check browser console to make sure there are no errors):
  * `http://localhost:3000/load_and_submit_form_with_fetch.html`
  * `http://localhost:3000/load_form_into_iframe.html`
  * `http://localhost:3000/load_form_into_iframe_no_embedding.html`
  * `http://localhost:3000/jquery_run_and_try_to_load_source.html`  

 
To demonstrate that cross-origin access will not work, enter the following into the browser's address field (check browser console for cross-origin error messages):
  * `http://localhost:8000/load_and_submit_form_with_fetch.html`
  * `http://localhost:8000/load_form_into_iframe.html`
     * Note: We can load the form with the csrf token into the iframe, and the user can submit the form successfully. However, our javascript cannot access or modify the contents of the form
  * `http://localhost:8000/load_form_into_iframe_no_embedding.html`
     * Note: With these headers, the browser will not allow the cross-origin form to be embedded in an iframe at all
  * `http://localhost:8000/jquery_run_and_try_to_load_source.html`  
     * Note: Code in `<script>` tags can always be executed cross-origin, but we cannot inspect its source cross-origin

[wireshark](https://wireshark.org "wireshark homepage") with `http` filter can be used to show that cross-origin requests are sent to the server and the responses are returned from the server to the browser. However, if CORS is not enabled on the server, the browser will block the relevant html or js code from reading the information returned from the server. 

