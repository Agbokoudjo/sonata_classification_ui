/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 * [GitHub - Agbokoudjo/sonata_classification_ui](https://github.com/Agbokoudjo/sonata_classification_ui)
 * For more information, please feel free to contact the author.
 */
import { BaseClassifications, SelectClassificationType } from "../interfaces";
import { ApiError, addParamToUrl, httpFetchHandler,mapStatusToResponseType } from "@wlindabla/form_validator";
import Swal from 'sweetalert2'
export async function onSubmitFormCategory(
    form: HTMLFormElement,
    urlFormAction: string,
    formatSendData: "json" | "formdata" = "json",
    baseUrl?: string | URL,
    message_before_send_data?: string,
    headersFetch?: HeadersInit,
): Promise<void> {
    const formContainer = form.closest(`div#${form.id}_form`);
    if (!formContainer) {
        console.error(`Form container not found for form ID: ${form.id}`);
        return;
    }
    const btn_submit = formContainer.querySelector<HTMLButtonElement>(`button[form="${form.id}"]`);
    const btn_cancel = formContainer.querySelector<HTMLButtonElement>(`button[id="${form.id}_cancel"]`);
    if (!btn_submit || !btn_cancel) {
        console.error("Submit or cancel button not found.");
        return;
    }
    btn_submit.disabled = true;
    btn_cancel.disabled = true;
    const context_value = form.querySelector<HTMLInputElement>('input[name^="context[name"]')!.value;
    if (!context_value) {
         Swal.fire({
                title: "Warning 422",
                html: `<div class="alert alert-warning" role="alert">
                          Please choose a context because the category is related to the context.
                    </div>`,
                icon: "warning",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
         });
         if (btn_submit) btn_submit.disabled = false;
        if (btn_cancel) btn_cancel.disabled = false;
        return;
    }
    let data_send: FormData | Record<string, unknown>;
    data_send = new FormData(form, btn_submit);
    // Vérification correcte de la case à cocher "enabled"
    const enabledInput = form.querySelector<HTMLInputElement>('input[name="enabled"]');
    data_send.append('enabled', enabledInput?.checked ? true.toString() : false.toString());
    if (formatSendData === "json") {
        data_send = Object.fromEntries(data_send) as Record<string, unknown>;
        data_send["enabled"] = true;
        data_send['context'] = { 'name': data_send['context[name]'] }
        delete data_send['context[name]'];
        // Ajout du Content-Type si non défini
        headersFetch = headersFetch ?? {
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json',
            'X-Requested-With': 'XMLHttpRequest'};
    }
    let timerInterval:number;
        Swal.fire({
                title: "Processing...",
                html: `<div class="alert alert-info" role="alert">
                            ${message_before_send_data ??
                    "Your request is being processed.<br/>Please wait, we are awaiting the server's response."}
                            <br/><b></b>
                    </div>`,
                icon: "info",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                timer: 6000,
                timerProgressBar: true,
                didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                    Swal.showLoading();
                    
                    const timerElement = Swal.getPopup()?.querySelector("b");
                    timerInterval = setInterval(() => {
                        if (timerElement) {
                            timerElement.textContent = `${Swal.getTimerLeft()}ms`;
                        }
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

    try {
        const response_data = await httpFetchHandler({
            url: addParamToUrl(urlFormAction, { 'classificationnew': true, 'category': true }, true, baseUrl),
            methodSend: 'POST',
            data: data_send,
            timeout: 9000,
            optionsheaders: headersFetch
        });
     const statusMessage = mapStatusToResponseType(response_data.status);

        if (statusMessage === "error") {
            throw new ApiError(response_data.data as string | Record<string, unknown>,response_data.status ?? 500);
        }
        if (statusMessage === "success") {
             const data = response_data.data as {message:string};
            Swal.fire({
                title: "Success",
                html: `<div class="alert alert-success" role="alert">
                            ${data.message}
                    </div>`,
                icon: "success",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });

            form.reset();
        }
    } catch (error:unknown) {
        console.error('Error', error);
        if (error instanceof Error) {
            Swal.fire({
                title: `Error`,
                html: `<div class="alert alert-danger" role="alert">
                        An error occurred:<br/>${error.message}
                </div>`,
                icon: "error",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });
            return;
        } 
        form.dispatchEvent(
            new CustomEvent('formSubmissionError', {
            bubbles: false,
            cancelable: false,
            composed: false,
            detail: {
                apiError:error,
                target: form,
            }
         }));
    
} finally {
    btn_submit.disabled = false;
    btn_cancel.disabled = false;
}

}
export async function onSubmitContext(
    form:HTMLFormElement,
    data: BaseClassifications[],
    urlFormAction: string,
    formatSendData: "json" | "formdata" = "json",
    resertField:()=>void,
    baseUrl?: string | URL,
    message_before_send_data?: string,
    headersFetch?: HeadersInit,
): Promise<void>{
    const btn_submit = form.closest(`div#${form.id}_form`)!.querySelector<HTMLButtonElement>(`button[form="${form.id}"]`)!;
     const btn_cancel = form.closest(`div#${form.id}_form`)!.querySelector<HTMLButtonElement>(`button[id="${form.id}_cancel"]`)!;
    btn_submit.disabled = true;
    btn_cancel.disabled = true;
    let data_to_be_sent: FormData | Record<number, BaseClassifications>;
    if (formatSendData === "formdata") {
        const formData= new FormData();
        data.forEach((item, index) => {
            formData.append(index.toString(),JSON.stringify(item))
        })
        data_to_be_sent = formData;
    } else {
        data_to_be_sent = Object.fromEntries(data.map((item, index) => [index, item]));
        // Ajout du Content-Type si non défini
        headersFetch = headersFetch ??{
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json',
             'X-Requested-With': 'XMLHttpRequest',
        };
    }
   let timerInterval:number;
        Swal.fire({
                title: "Processing...",
                html: `<div class="alert alert-info" role="alert">
                            ${message_before_send_data ??
                    "Your request is being processed.<br/>Please wait, we are awaiting the server's response."}
                            <br/><b></b>
                    </div>`,
                icon: "info",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                timer: 6000,
                timerProgressBar: true,
                didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                    Swal.showLoading();
                    
                    const timerElement = Swal.getPopup()?.querySelector("b");
                    timerInterval = setInterval(() => {
                        if (timerElement) {
                            timerElement.textContent = `${Swal.getTimerLeft()}ms`;
                        }
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
    try {
        const response_data = await httpFetchHandler(
            {
                url: addParamToUrl(urlFormAction,{ 'classificationnew': true, 'context': true }, true, baseUrl),
                methodSend:"POST",
                data:data_to_be_sent,
                timeout: 6000,
                optionsheaders:headersFetch,
                responseType:"json"
            })
        const statusMessage = mapStatusToResponseType(response_data.status);

        if (statusMessage === "error") {
            throw new ApiError(response_data.data as string | Record<string, unknown>,response_data.status);
        }
        if (statusMessage === "success") {
            const data = response_data.data as {message:string};
            Swal.fire({
                title: "Success",
                html: `<div class="alert alert-success" role="alert">
                            ${data.message}
                    </div>`,
                icon: "success",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });

            form.reset();
            resertField();
            btn_cancel.innerText='Close'
        }
    } catch (error) {
          console.error('Error', error);
        if (error instanceof Error) {
            Swal.fire({
                title: `Error`,
                html: `<div class="alert alert-danger" role="alert">
                        An error occurred:<br/>${error.message}
                </div>`,
                icon: "error",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });
            return;
        } 
        form.dispatchEvent(
            new CustomEvent('formSubmissionError', {
            bubbles: false,
            cancelable: false,
            composed: false,
            detail: {
                apiError: error,
                target: form,
            }
         }));
    
    }
    finally {
        if (btn_submit) btn_submit.disabled = false;
        if (btn_cancel) btn_cancel.disabled = false;
    }
    return;
}
export async function onSubmitTag(
    form: HTMLFormElement,
    data: BaseClassifications[],
    urlFormAction: string,
    formatSendData: "json" | "formdata" = "json",
    resertField: () => void,
    baseUrl?: string | URL,
    message_before_send_data?: string,
    headersFetch?: HeadersInit,
): Promise<void> { 
    const btn_submit = form.closest(`div#${form.id}_form`)!.querySelector<HTMLButtonElement>(`button[form="${form.id}"]`)!;
     const btn_cancel = form.closest(`div#${form.id}_form`)!.querySelector<HTMLButtonElement>(`button[id="${form.id}_cancel"]`)!;
    btn_submit.disabled = true;
    btn_cancel.disabled = true;
    const context_value = form.querySelector<HTMLInputElement>('input[name^="context[name"]')!.value;
    if (!context_value) {
         Swal.fire({
                title: "Warning 422",
                html: `<div class="alert alert-warning" role="alert">
                          Please choose a context because the tag is related to the context.
                    </div>`,
                icon: "warning",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });
             if (btn_submit) btn_submit.disabled = false;
            if (btn_cancel) btn_cancel.disabled = false;
        return;
    }
    let data_to_be_sent: FormData | Record<string, unknown>;
    if (formatSendData === "formdata") {
         data_to_be_sent = new FormData();
         data_to_be_sent.append('tags',JSON.stringify(data))
         data_to_be_sent.append("context[name]",context_value)
    } else {
         data_to_be_sent = {};
         data_to_be_sent['tags']=data;
          data_to_be_sent['context'] = { 'name':context_value}
        // Ajout du Content-Type si non défini
        headersFetch = headersFetch ??{
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json',
             'X-Requested-With': 'XMLHttpRequest',
        };
     }
    let timerInterval:number;
        Swal.fire({
                title: "Processing...",
                html: `<div class="alert alert-info" role="alert">
                            ${message_before_send_data ??
                    "Your request is being processed.<br/>Please wait, we are awaiting the server's response."}
                            <br/><b></b>
                    </div>`,
                icon: "info",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                timer: 6000,
                timerProgressBar: true,
                didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                    Swal.showLoading();
                    
                    const timerElement = Swal.getPopup()?.querySelector("b");
                    timerInterval = setInterval(() => {
                        if (timerElement) {
                            timerElement.textContent = `${Swal.getTimerLeft()}ms`;
                        }
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
    try {
        const response_data = await httpFetchHandler(
            {
                url: addParamToUrl(urlFormAction,{ 'classificationnew': true, 'tag': true }, true, baseUrl),
                methodSend:"POST",
                data:data_to_be_sent,
                timeout: 6000,
                optionsheaders:headersFetch,
                responseType:"json"
            })
        const statusMessage = mapStatusToResponseType(response_data.status);

        if (statusMessage === "error") {
            throw new ApiError(response_data.data as string | Record<string, unknown>,response_data.status);
        }
        if (statusMessage === "success") {
            const data = response_data.data as {message:string};
            Swal.fire({
                title: "Success",
                html: `<div class="alert alert-success" role="alert">
                            ${data.message}
                    </div>`,
                icon: "success",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false, 
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });

            form.reset();
            resertField();
            btn_cancel.innerText='Close'
        }
    } catch (error) {
          console.error('Error', error);
        if (error instanceof Error) {
            Swal.fire({
                title: `Error 500`,
                html: `<div class="alert alert-danger" role="alert">
                        An error occurred:<br/>${error.message}
                </div>`,
                icon: "error",
                animation: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: "#283c63",
                color: "#fff",
                 didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
            });
            return;
        } 
        form.dispatchEvent(
            new CustomEvent('formSubmissionError', {
            bubbles: false,
            cancelable: false,
            composed: false,
            detail: {
                apiError: error,
                target: form,
            }
         }));
    
    }
    finally {
        if (btn_submit) btn_submit.disabled = false;
        if (btn_cancel) btn_cancel.disabled = false;
    }
    return;
}
export function transformClassificationToString(data: SelectClassificationType[]): string {
    return data.map(item => item.name).join(',');
}
