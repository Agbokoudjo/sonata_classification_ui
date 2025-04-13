## Author Information

- **Name:** AGBOKOUDJO Franck
- **Email:** [franckagbokoudjo301@gmail.com](mailto:franckagbokoudjo301@gmail.com)
- **Phone:** +229 0167 25 18 86
- **LinkedIn:** [Internationales Web Services](https://www.linkedin.com/in/internationales-web-services-120520193/)
- **Company:** INTERNATIONALES WEB SERVICES
- **GitHub Repository:** [sonata_classification_ui](https://github.com/Agbokoudjo/sonata_classification_ui)

# Sonata Classification UI Components

This project provides a collection of customizable React UI components to manage Sonata Classification entities such as **Context**, **Tag**, and other related entities using modern design and fully dynamic form creation.

These components are ideal for admin panels or CMS integrations.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [SelectContext](#selectcontext)
  - [SonataContext](#sonatacontext)
  - [SonataTag](#sonatatag)
- [Shared Types](#shared-types)

``` typescript
export type InputNameClassification = {
  /**
   * Placeholder text displayed inside the input field.
   */
  placeholder?: string;

  /**
   * CSS class applied to the input field for styling.
   */
  classNameField?: string;

  /**
   * Additional HTML attributes to be passed directly to the input element.
   */
  htmlInputOptions?: Record<string, unknown>;

  /**
   * List of CSS classes applied to the row container wrapping the input.
   */
  classNameRowContainer?: string[];

  /**
   * List of CSS classes applied to the container of the text field.
   */
  classNameTextFieldContainer?: string[];

  /**
   * List of CSS classes applied to the label of the text field.
   */
  classNameLabelTextField?: string[];

  /**
   * The visible label text displayed above or beside the input field.
   */
  labelTextField?: string;

  /**
   * Validation options specific to this input field.
   */
  optionsValidatorField?: OptionsInputField;
};
```
| **Property**                | **Type**                   | **Description**|

|----------------------------|----------------------------|-----------------------------------------------------------------------------|
| `placeholder`              | `string`                   | Text to display inside the input field before the user types.              |
| `classNameField`           | `string`                   | CSS class for styling the input field.                                     |
| `htmlInputOptions`         | `Record<string, unknown>`  | Additional HTML attributes to pass to the `<input>` element.               |
| `classNameRowContainer`    | `string[]`                 | List of CSS classes for the row container wrapping the input.              |
| `classNameTextFieldContainer` | `string[]`              | CSS classes applied to the main input container.                           |
| `classNameLabelTextField`  | `string[]`                 | CSS classes applied to the label element.                                  |
| `labelTextField`           | `string`                   | Label displayed next to or above the input field.                          |
| `optionsValidatorField`    | `OptionsInputField`        | Validation rules or config passed to the field.                            |

### CheckboxClassification

| **Property**               | **Type**                   | **Description**|
|---------------------------|----------------------------|---------------------------------------------------------------------------|
| `classNameCheckbox`       | `string[]`                 | CSS classes applied to the `<input type="checkbox">` element.            |
| `classNameLabel`          | `string[]`                 | CSS classes applied to the `<label>` associated with the checkbox.       |
| `classNameContainer`      | `string[]`                 | CSS classes for the container that wraps the checkbox and label.         |
| `labelCheckbox`           | `string`                   | Label text displayed next to the checkbox.                               |
| `htmlInputOptionsCheckbox`| `Record<string, unknown>`  | Additional HTML attributes for the checkbox element.                     |

### OptionsCollectionItemClassification

| **Property**                          | **Type**                          | **Description**|
|--------------------------------------|-----------------------------------|---------------------------------------------------------------------------------|
| `classNameClassificationItem`        | `string[]`                        | CSS classes applied to each classification item in the list.                   |
| `classNameClassificationContainerTitle` | `string[]`                     | CSS classes for the title container of the classification section.             |
| `classNameContainerDelete`           | `string[]`                        | CSS classes for the container that wraps the delete button.                    |
| `classNameButtonDelete`              | `string[]`                        | CSS classes applied to the delete button element.                              |
| `labelButtonDelete`                  | `string`                          | Text displayed inside or near the delete button.                               |
| `classNameIconDelete`                | `string[]`                        | CSS classes applied to the icon inside the delete button.                      |
| `nameFieldOptions`                   | `InputNameClassification`         | Configuration options for the input field related to the classification name.  |
| `optionsCheckbox`                    | `CheckboxClassification`          | Configuration options for the checkbox input.                                  |
| `classNameContainerAdd`              | `string[]`                        | CSS classes for the container that wraps the add button.                       |
| `classNameButtonAdd`                 | `string[]`                        | CSS classes applied to the add button element.                                 |
| `labelButtonAdd`                     | `string`                          | Text displayed inside or near the add button.                                  |
| `classNameIconAdd`                   | `string[]`                        | CSS classes applied to the icon inside the add button.                         |



### ClassificationOptions

| **Property**                           | **Type**                              | **Description**                                                                 |
|----------------------------------------|---------------------------------------|---------------------------------------------------------------------------------|
| `classNameButtonOpen`                  | `string[]`                            | CSS classes applied to the button that opens the classification.                |
| `childrenButtonOpen`                   | `ReactNode | string`                  | Content (text or elements) displayed inside the open button.                    |
| `styleButtonOpen`                      | `CSSProperties`                       | Inline styles for the button that opens the classification.                     |
| `classNameDialog`                      | `string[]`                            | CSS classes applied to the dialog container.                                    |
| `styleDialog`                          | `CSSProperties`                       | Inline styles for the dialog container.                                         |
| `childrenDialogTitle`                  | `ReactNode | string`                  | Title content inside the dialog.                                                |
| `urlAction`                            | `string`                              | The URL to which the form data will be sent.                                    |
| `baseUrl`                              | `string | URL`                        | The base URL for the action, can be used for constructing the full URL.         |
| `methodSend`                           | `string`                              | The HTTP method to be used for sending the request (e.g., "POST", "GET").       |
| `classNameForm`                        | `string[]`                            | CSS classes applied to the form element.                                        |
| `classNameCancelButton`                | `string[]`                            | CSS classes applied to the cancel button.                                       |
| `childrenCancelButton`                 | `ReactNode | string`                  | Content (text or elements) displayed inside the cancel button.                  |
| `classNameDialogActionContainer`       | `string[]`                            | CSS classes for the container that wraps the dialog action buttons (submit/cancel). |
| `classNameSubmitButton`                | `string[]`                            | CSS classes applied to the submit button.                                       |
| `styleSubmitedButton`                  | `CSSProperties`                       | Inline styles for the submit button after submission.                           |
| `childrenSubmitedButton`               | `ReactNode | string`                  | Content (text or elements) displayed inside the submit button after submission. |
| `formToken`                            | `string`                              | Token for CSRF protection during form submission.                               |
| `formatSendData`                       | `"json" | "formdata"`                 | Format in which the data will be sent (either JSON or FormData).                |
| `messageBeforeSendData`                | `string`                              | Optional message to display before sending data.                                |
| `headersFetch`                         | `HeadersInit`                         | Custom headers to be added to the fetch request.                                 |

### SelectContext Props

| **Property**         | **Type**             | **Description**                                                                 |
|----------------------|----------------------|---------------------------------------------------------------------------------|
| `nameSelect`         | `string`             | The name attribute of the select input.                                         |
| `urlRoute`           | `string`             | The URL route to fetch context data.                                            |
| `baseUrl`            | `string` \| `URL`    | Optional base URL used to construct full request URLs.                          |
| `labelSelect`        | `string`             | Label for the input field rendered by `TextField`.                              |
| `labelPlaceholder`   | `string`             | Placeholder text displayed when no context is selected.                         |
| `colorItem`          | `string`             | CSS color used to style each option in the list.                                |
| `labelLoadMore`      | `string`             | Text displayed on the "Load More" button.                                       |
| `labelRefreshData`   | `string`             | Text displayed on the "Refresh" button to reload context data.   
               |
```tsx
  import { SelectContext } from '@wlindabla/sonata_classification_ui';

function MyComponent() {
  return (
    <SelectContext
      nameSelect="context[name]"
      labelSelect="Context"
      urlRoute="/api/admin.sonata.classification/context/list"
      baseUrl="http://127.0.0.1:8001"
    />
  );
}
```
```tsx
import { SonataContext } from  '@wlindabla/sonata_classification_ui';

function MyComponent() {
  return (
    <SonataContext
      urlAction='/api/admin.sonata.classification/context/create'
      baseUrl="http://127.0.0.1:8001"
      childrenCancelButton={'Cancel'}
      childrenDialogTitle={
        <h3 className="float-md-start form-title-heading text-info text-center mb-2 fw-bolder"
            style={{ textTransform: 'uppercase', color: '#283c63' }}>
          creating of collection new objet context
        </h3>
      }
      optionscollectionitem={{
        labelButtonDelete: "remove",
        classNameClassificationItem: ["border", "border-1", "border-white", "mb-3", "mt-2"],
        labelButtonAdd: 'Add',
        nameFieldOptions: {
          labelTextField: "Name",
          classNameLabelTextField: ["form-label", "text-warning", "fw-bold"]
        },
        optionsCheckbox: {
          labelCheckbox: "Enabled",
          classNameLabel: ["text-warning", "form-check-label", "fw-bolder"]
        }
      }}
    />
  );
}
```
# Used to create a new Tag entity, including the ability to select a Context dynamically.
```tsx
  import { SonataTag } from  '@wlindabla/sonata_classification_ui';
function MyComponent() {
  return (
    <SonataTag
      urlAction='/api/admin.sonata.classification/tag/create'
      baseUrl="http://127.0.0.1:8001"
      childrenCancelButton={'Cancel'}
      childrenDialogTitle={
        <h3 className="float-md-start form-title-heading text-info text-center mb-2 fw-bolder"
            style={{ textTransform: 'uppercase', color: '#283c63' }}>
          creating of collection new objet tag
        </h3>
      }
      optionscollectionitem={{
        labelButtonDelete: "remove",
        classNameClassificationItem: ["border", "border-1", "border-white", "mb-3", "mt-2"],
        labelButtonAdd: 'Add',
        nameFieldOptions: {
          labelTextField: "Name",
          classNameLabelTextField: ["form-label", "text-warning", "fw-bold"]
        },
        optionsCheckbox: {
          labelCheckbox: "Enabled",
          classNameLabel: ["text-warning", "form-check-label", "fw-bolder"]
        }
      }}
      context_options={{
        urlRoute: "/api/admin.sonata.classification/context/list",
        nameSelect: 'context',
        labelSelect: 'Context'
      }}
    />
  );
}
```
```tsx
import { SelectTag } from  '@wlindabla/sonata_classification_ui';
function MyComponent(){
  return(<SelectTag
        nameSelect='tag[name]'
        labelSelect='Tag'
        urlRoute='/api/admin.sonata.classification/tag/list'
        baseUrl='http://127.0.0.1:8001'
      />)
}
```
# Used to create a new Category entity, including the ability to select a Context dynamically and set the Enabled status
```tsx
import { SonataCategory } from  '@wlindabla/sonata_classification_ui';
function MyComponent(){
  return(
    <SonataCategory
  urlAction='/api/admin.sonata.classification/category/create'
  baseUrl="http://127.0.0.1:8001"
  childrenCancelButton={'Cancel'}
  childrenDialogTitle={
    <h3 className="float-md-start form-title-heading text-info text-center mb-2 fw-bolder"
        style={{ textTransform: 'uppercase', color: '#283c63' }}>
        Creating a new category
    </h3>
  }
  optionsCheckbox={{
    labelCheckbox: "Enabled",
    classNameLabel: ["text-warning", "form-check-label", "fw-bolder"]
  }}
  context_options={{
    nameSelect: 'context',
    labelSelect: 'Context',
    urlRoute: '/api/admin.sonata.classification/context/list'
  }}
/>
  )
}
```