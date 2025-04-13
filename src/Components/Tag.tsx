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
import { BaseClassifications, ClassificationOptions, SelectBaseClassficationConfig, SelectClassificationType } from "../interfaces";
import { OptionsCollectionItemClassification, ErrorState, ErrorMessageState } from "../types";
import React, { memo,Fragment, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box'
import {
    FormInputValidator, escapeHtmlBalise, ApiError,
    addParamToUrl, mapStatusToResponseType, httpFetchHandler
} from "@wlindabla/form_validator";
import Swal from 'sweetalert2'
const formInputValidator = FormInputValidator.getInstance();
import { ValidatorErrorField } from "@wlindabla/sonata_shared";
import { onSubmitTag, transformClassificationToString } from "../hooks/hooks";
import Autocomplete from '@mui/material/Autocomplete';
export interface ContextInterface extends BaseClassifications {
    id: string | number;
    createdAt: Date|string;
    updatedAt: Date|string;
}

export interface TagOptions extends ClassificationOptions{
    optionscollectionitem: OptionsCollectionItemClassification;
    context_options:SelectBaseClassficationConfig;
}
import { SelectContext } from "./Context";
/**
 * @create tag
 */
export const SonataTag: React.FC<TagOptions> = memo(function SonataTag({
        classNameButtonOpen,
        styleButtonOpen,
        childrenButtonOpen,
        classNameDialog,
        urlAction,
        styleDialog,
        childrenDialogTitle,
        classNameForm,
        childrenCancelButton,
        optionscollectionitem,
        formToken,
        childrenSubmitedButton,
        styleSubmitedButton,
        classNameSubmitButton,
        classNameDialogActionContainer,
        classNameCancelButton,
       formatSendData = "json",
        baseUrl,
        messageBeforeSendData,
         headersFetch,
        context_options
}: TagOptions) {
    const [isOpenTag, setIsOpenTag] = useState(false);
    const handleOpenTag = (): void => { setIsOpenTag(true); }
    const handleCloseTag = (): void => { setIsOpenTag(false); }
    const [tagCollection, setTagCollection] = useState<BaseClassifications[]>([{ name: "", enabled: false }]);
     const [isdisabled, setIsDisabled] = useState<boolean>(false);
    const [changeLabelClose, setChangeLabelClose] = useState(childrenCancelButton);
    const [errorsClassification, setErrorsClassification] = useState<ErrorState>({});
    const [errormessagefieldClassification, setErrormessagefieldClassification] = useState<ErrorMessageState>({});
     /**
      * handle click event of the Add button
      */
    const handleAddTag= () => {
        setTagCollection([...tagCollection, { name: "", enabled: false }]);
         setChangeLabelClose(childrenCancelButton)
  };
    /**
     * remove un item of collection context
     * @param index 
     */
    const handleRemoveTag = (index: number)=>{
        const clone_context_collection = [...tagCollection];
        const tri_context = clone_context_collection.filter((_, indexFilter) => !(indexFilter === index));
        setTagCollection(tri_context);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { type, checked, id, value } = e.target as HTMLInputElement;
        const tag_list = [...tagCollection];
         const old_base_classification = tag_list[index];
        if (type === "checkbox") {
            old_base_classification.enabled = checked;
            tag_list[index] = old_base_classification;
            setTagCollection(tag_list)
            return;
        }
        if (type === "text" && value.length>0) {
            old_base_classification.name =escapeHtmlBalise(value, true) as string;
            tag_list[index] = old_base_classification;
             setTagCollection(tag_list)
        }
        if (errorsClassification[id]) {
            setErrorsClassification(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[id];
                return newErrors;
            });
        }
        if (errormessagefieldClassification[id]) {
            setErrormessagefieldClassification(prevErrormessagefield => {
                const newErrorMessages = { ...prevErrormessagefield };
                delete newErrorMessages[id];
                formInputValidator.clearError(id);
                return newErrorMessages;
            });
        }
        setIsDisabled(false);
        setChangeLabelClose(childrenCancelButton);
        return;
    }
    const onBlurHandle = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, i: number) => {
        const refInputCurrent = event.target as HTMLInputElement;
        const valueInput = refInputCurrent.value;
        if (valueInput.length <= 0) { console.log(`name_${i}`); return; }
       formInputValidator.textValidator(valueInput.trim(), refInputCurrent.id,
            optionscollectionitem.nameFieldOptions?.optionsValidatorField ||
            {
                minLength: 3, maxLength: 50, regexValidator: /^[a-zA-ZÀ-ÿ0-9À-ÖØ-öø-ÿŒœÆæ\s]+$/i,
                escapestripHtmlAndPhpTags: true,
                errorMessageInput: `the name ${valueInput} of tag name is invalid`,
                egAwait:"tag"
            }
       )
        if (formInputValidator.hasErrorsField(refInputCurrent.id)=== false) {
            setErrorsClassification(prevErrors => ({
            ...prevErrors,
            [refInputCurrent.id]:true
          }));
          setErrormessagefieldClassification(prevErrormessagefield => ({
            ...prevErrormessagefield,
            [refInputCurrent.id]: formInputValidator.getErrorMessageField(refInputCurrent.id)
          }));
          setIsDisabled(true);
        }
    }
    const resertField = () => {
        setTagCollection([{name: "",enabled: false,}])
    }
    // Ajouter un écouteur d'événement temporaire
    const handleFormError = (event: CustomEvent) => {
        const apiError = event.detail.apiError as ApiError;
        const all_errors = apiError.allViolations;
        Swal.fire({
            title: `Error ${apiError.status ?? 500}`,
            html: `<div class="alert alert-danger" role="alert">
                        ${apiError.name}
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
        if (Object.hasOwn(all_errors, 'name')) {
            for (const [name, messages] of Object.entries(all_errors)) {
             setErrorsClassification(prevErrors => ({
            ...prevErrors,
            [name]: true
          }));
          setErrormessagefieldClassification(prevErrormessagefield => ({
            ...prevErrormessagefield,
            [name]: messages
          }));
            
        }
        setIsDisabled(true);
        }
    };
    return (
        <Fragment>
            <Button className={classNameButtonOpen?.join(" ") || "btn-category-click text-white btn fw-bold"}
                type="button" onClick={handleOpenTag}
                style={styleButtonOpen || { backgroundColor: '#283c63' }}>
                {childrenButtonOpen || <span>Add a new Tag</span>}
            </Button>
            <Dialog open={isOpenTag} onClose={handleCloseTag}  component="div"
                className={classNameDialog?.join(" ") || "modal-dialog-tag"}
                id="sonata_classification_tag_form"
                style={styleDialog || { justifyContent: "center" }}>
                <Box sx={{backgroundColor: '#283c63',color:"#fff"}}>
                 <DialogTitle component="div" id="responsive-dialog-title">
                    {childrenDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <div className="centered">
                        <form className={classNameForm?.join(" ") || "form sonata_classification"}
                                id="sonata_classification_tag"
                                name="sonata_classification_tag"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                     form.addEventListener("formSubmissionError", handleFormError as EventListener);
                                    await onSubmitTag(
                                        form,
                                        tagCollection,
                                        urlAction,
                                        formatSendData ?? 'json',
                                        resertField,
                                        baseUrl,
                                        messageBeforeSendData,
                                        headersFetch,
                                    )
                                    form.removeEventListener("formSubmissionError", handleFormError as EventListener);
                                }}
                                
                            >  
                            <div className="form-field-tag">
                                {
                                    tagCollection.map((item_tag, position) => {
                                        return (
                                            <div className={optionscollectionitem.classNameClassificationItem?.join(" ") || "container-classification context-item"}
                                                key={position}>
                                                <div className={
                                                    optionscollectionitem.classNameClassificationContainerTitle?.join(" ") ||
                                                    "text-warning fw-bolder text-center mt-1"
                                                }>TAG { position +1}</div>
                                                <div className={optionscollectionitem.classNameContainerDelete?.join((" "))
                                                    || "float-sm-end mb-2 d-flex flex-column justify-content-end me-2"}>
                                                    {
                                                        tagCollection.length !== 1 && (
                                                            <button type="button"
                                                                className={optionscollectionitem.classNameButtonDelete?.join(" ") ||
                                                                    "mr10 btn btn-danger text-white fw-bold"}
                                                                onClick={() => handleRemoveTag(position)}
                                                            >
                                                                <DeleteIcon color="inherit" className={optionscollectionitem.classNameIconDelete?.join(" ") || "fw-bold"}>
                                                                </DeleteIcon><span>{optionscollectionitem.labelButtonDelete || "remove context"} {position +1} </span>
                                                        </button>
                                                    )}                                                     
                                                </div>
                                                <div className={optionscollectionitem.nameFieldOptions?.classNameRowContainer?.join(" ") || "row bg-transparent d-flex flex-column"}>
                                                    <div className={optionscollectionitem.nameFieldOptions?.classNameTextFieldContainer?.join(" ")|| "col me-1"}>
                                                        <label htmlFor={`name_${position}`}
                                                            className={optionscollectionitem.nameFieldOptions?.classNameLabelTextField?.join(" ") || "form-label text-white fw-bold me-1"}>
                                                                {optionscollectionitem.nameFieldOptions?.labelTextField || "Name"}
                                                        </label>
                                                        <TextField
                                                            id={`name_${position}`}
                                                            type="text"
                                                            name={`name_${position}`}
                                                            key={position}
                                                            fullWidth
                                                            autoFocus
                                                            placeholder={`${optionscollectionitem.nameFieldOptions?.placeholder || "Tag"} ${position +1}`}
                                                            slotProps={{
                                                                htmlInput: 
                                                                    optionscollectionitem.nameFieldOptions?.htmlInputOptions || {
                                                                         minLength:"3",maxLength:"50",className:'form-control name'
                                                                    }
                                                            }}
                                                            value={item_tag.name}
                                                            required={true}
                                                            onChange={(e) => handleInputChange(e,position)}
                                                            onBlur={(e) => onBlurHandle(e, position)}
                                                            error={errorsClassification[`name_${position}`]}
                                                            helperText=
                                                            {errorsClassification[`name_${position}`] &&
                                                                <ValidatorErrorField
                                                                    errordisplay={true}
                                                                    messageerror={errormessagefieldClassification[`name_${position}`] as string[]}
                                                                    classnameerror={["fw-bold", "text-danger", "mt-2","error-message"]}
                                                                />
                                                            }
                                                        >
                                                        </TextField>
                                                    </div>
                                                    <div className={
                                                        optionscollectionitem.optionsCheckbox?.classNameContainer?.join(" ") ||
                                                        "col ms-2 form-check mt-1"
                                                    }>
                                                        <label htmlFor={`enabled_${position}`}
                                                            className={optionscollectionitem.optionsCheckbox?.classNameLabel?.join(" ") ||
                                                                "form-check-label text-white fw-bolder"}
                                                        >
                                                                {optionscollectionitem.optionsCheckbox?.labelCheckbox || "enabled"}
                                                        </label>
                                                        <Checkbox slotProps={
                                                            optionscollectionitem.optionsCheckbox?.htmlInputOptionsCheckbox || 
                                                                {
                                                                    className: 'form-check-input'
                                                                }
                                                            }
                                                            required={false}
                                                            key={position}
                                                            checked={item_tag.enabled}
                                                            onChange={(e) => handleInputChange(e,position)}
                                                            name={`enabled_${position}`}
                                                            color="primary"
                                                            id={`enabled_${position}`}
                                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className={
                                    optionscollectionitem.classNameContainerAdd?.join(" ") || 
                                    "col-auto mt-3 float-sm-start mb-4"
                                }>
                                    <button type="button" onClick={handleAddTag}
                                        className={
                                            optionscollectionitem.classNameButtonAdd?.join(" ") || 
                                            "btn btn-info border-info text-white mb-4 fw-bold border rounded-3 text-center"
                                        }>
                                        <Icon color='info' baseClassName="fas"
                                            className={
                                                optionscollectionitem.classNameIconAdd?.join(" ") ??
                                                "fa-plus-circle me-2"
                                            }></Icon>
                                        {
                                            optionscollectionitem.labelButtonAdd || "Add"
                                        }
                                    </button>
                                    </div><br/>
                                    <TextField type="hidden" name="_token" value={formToken || "formToken"} />
                                     <div className="col-12  context-container">
                                        <SelectContext
                                        nameSelect="context[name]"
                                        urlRoute={context_options.urlRoute}
                                        baseUrl={baseUrl}
                                        labelSelect="Context"
                                        labelLoadMore={context_options.labelLoadMore}
                                        labelRefreshData={context_options.labelRefreshData}
                                        labelPlaceholder={context_options.labelPlaceholder}
                                    />
                                    </div>
                            </div>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                        <div className={classNameDialogActionContainer?.join(" ") ||
                            "d-flex flex-row justify-content-md-around actions-container"}>
                        <button type="button"
                        id={`sonata_classification_tag_cancel`}
                        onClick={handleCloseTag}
                        disabled={isdisabled}
                        className={classNameCancelButton?.join("  ") ||
                                    "btn btn-secondary text-white fw-bold border me-2 ms-1 border-secondary  rounded-3 "}>
                        { changeLabelClose }
                        </button>
                        <Button type="submit"
                            form='sonata_classification_tag'
                            variant="contained"
                            disabled={isdisabled}
                            sx={{ borderRadius: '40px' }} // Bordures arrondies
                            endIcon={<SendIcon />}
                                className={classNameSubmitButton?.join(" ") ||
                                    "btn text-white btn-primary  border-primary  rounded-3"}
                            style={styleSubmitedButton || {fontWeight:"bold"}}
                        >
                            {childrenSubmitedButton || "Send"}
                        </Button>
                    </div>
                    </DialogActions>
                    </Box>
            </Dialog>
        </Fragment>
    );
});
export const SelectTag: React.FC<SelectBaseClassficationConfig> = memo(function SelectTag({
  nameSelect,
    urlRoute,
  baseUrl,
  labelSelect,
  labelPlaceholder,
  colorItem,
   labelLoadMore,
  labelRefreshData
}: SelectBaseClassficationConfig) {
    const [loading, setLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [completeTagList, setCompleteTagList] = useState<SelectClassificationType[]>([]);
     const [nextUrl,setNextUrl]=useState<string>(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    const loadMoreHandle = () => {
        setNextUrl(document.querySelector('#loadMoreTag')!.getAttribute('url-action')!)
     }
    const refreshDataHandle = () => {
        setRefreshData(true); 
        setNextUrl(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    }
    useEffect(() => {
        const fetchTag= async () => {
            setLoading(true)
            try {
                const response_data_tag = await httpFetchHandler({
                url:nextUrl,
                optionsheaders: {
                    'Accept': "application/ld+json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                timeout:9000
            })
                const status_type = mapStatusToResponseType(response_data_tag.status);
                if (status_type === "error") {
                    throw new ApiError(response_data_tag.data as string|Record<string, unknown>, response_data_tag.status);
                }
                // si la status de la response est success
                const data = response_data_tag.data as
                    {
                        member: [{ id: string, name: string }],
                        totalItems: number,
                         view?: {
                            '@id':string,
                            first: string,
                            last?: string,
                            previous?: string,
                            next?: string
                            },
                    };
                const tag_list = [...completeTagList];
                data.member.map((item) => (
                    tag_list.push({
                        id: item.id,
                        name:item.name
                    })
                ))
                setCompleteTagList(tag_list);
                if (data.view) {
                    const url_recovery_data = data.view.next ?? data.view.last ?? nextUrl
                    document.querySelector('#loadMoreTag')!.setAttribute(
                        'url-action',
                        addParamToUrl(url_recovery_data,null,true,baseUrl) as string);
              }
            } catch (error) {
                console.log('Error:', error)
                let status = 404;
                let message = "An error occurred:<br/>";
                if (error instanceof ApiError) {
                    status = error.status;
                    message = error.name;
                   }
                    Swal.fire({
                        title: `Error ${status ?? 404}`,
                        html: `<div class="alert alert-danger" role="alert">
                                ${message}
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
            }
            finally {setLoading(false);}
        }
        fetchTag();
    }, [refreshData,nextUrl])
    return (
        <Fragment>
             <Autocomplete 
                id={nameSelect}
                loading={loading}
                loadingText={'loading in progress...'}
                autoHighlight
                fullWidth={true}
                autoSelect
                autoComplete={true}
                sx={{ width: '100%' }}
                options={completeTagList}
                multiple={true}
                getOptionLabel={(option: SelectClassificationType) => option.name}
                getOptionKey={(option: SelectClassificationType) => option.id}
                renderOption={(props, option: SelectClassificationType) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                        sx = {{ color: colorItem ?? 'black', fontWeight:'bolder' }
                    }
                        {...optionProps}
                        >
                            {option.name} {option.id}
                        </Box>
                        )
                }}
                onChange={(
                    event: React.SyntheticEvent<Element, Event>,
                    newValue: SelectClassificationType[]
                ) => {
                    console.log(event)
                    const inputTextField = document.querySelector<HTMLInputElement>(
                        `input[name="${nameSelect}"]`
                    );
                    if (inputTextField) {
                        inputTextField.value = transformClassificationToString(newValue);
                    }
                    }}
                 renderInput={(params) => (
                        <TextField
                        {...params}
                         label={labelSelect}
                         name={nameSelect}
                        type="text"
                        slotProps={{
                            htmlInput: {
                            ...params.inputProps,
                            className: 'form-control',
                            autoComplete:'on'
                            }
                        }}
                        fullWidth={true}
                        placeholder={labelPlaceholder ?? 'choose tags'}
                        ></TextField>
                    )}
            /> 
            <div className="d-flex flex-row">
                <div className="loadMore mt-2 mb-2">
                    <Button className="btn bg-info text-white fw-800"
                        onClick={loadMoreHandle}
                        id="loadMoreTag"
                    >
                        {labelLoadMore ?? 'load more'}
                    </Button>
                </div>
                <div className="refreshData mt-2 mb-2 ms-2">
                    <Button className="btn bg-secondary text-white fw-800"
                        onClick={refreshDataHandle}
                        id="refreshData"
                    >
                        {labelRefreshData ?? 'refresh tag'}
                    </Button>
                </div>
           </div>
        </Fragment>
    )
})