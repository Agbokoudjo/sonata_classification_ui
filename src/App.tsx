import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SelectContext, SonataContext } from "./Components/Context"
import { SelectCategory, SonataCategory } from "./Components/Category"
import { SelectTag, SonataTag } from "./Components/Tag";
function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <SonataContext 
        urlAction='/api/admin.sonata.classification/context/create'
        baseUrl="http://127.0.0.1:8001"
        childrenCancelButton={'Cancel'}
        childrenDialogTitle={
          <h3 className="float-md-start form-title-heading text-info text-center  mb-2 fw-bolder"
              style={{ textTransform: 'uppercase', color: '#283c63' }}>
              creating of collection new objet context
            </h3>
        }
        optionscollectionitem={{
          labelButtonDelete:"remove",
          classNameClassificationItem:["border","border-1","border-white","mb-3","mt-2"],
          labelButtonAdd: 'Add',
          nameFieldOptions: {
            labelTextField: "Name",
            classNameLabelTextField:["form-label","text-warning","fw-bold"]
          },
          optionsCheckbox:{
            labelCheckbox: "Enabled",
            classNameLabel:["text-warning","form-check-label","fw-bolder"]
          }
        }}
      />
      <hr /><br />
       <SonataCategory
        urlAction='/api/admin.sonata.classification/category/create'
        baseUrl="http://127.0.0.1:8001"
        childrenCancelButton={'Cancel'}
        childrenDialogTitle={
          <h3 className="float-md-start form-title-heading text-info text-center  mb-2 fw-bolder"
              style={{ textTransform: 'uppercase', color: '#283c63' }}>
              creating of new objet category
            </h3>
        }
       optionsCheckbox={
         {
              labelCheckbox: "Enabled",
            classNameLabel:["text-warning","form-check-label","fw-bolder"]
           }
          }
        context_options={{
          urlRoute: "/api/admin.sonata.classification/context/list",
          nameSelect: 'context',
          labelSelect:'Context'
        }}
      />
      <hr /><br />
      <SonataTag
        urlAction='/api/admin.sonata.classification/tag/create'
        baseUrl="http://127.0.0.1:8001"
        childrenCancelButton={'Cancel'}
        childrenDialogTitle={
          <h3 className="float-md-start form-title-heading text-info text-center  mb-2 fw-bolder"
              style={{ textTransform: 'uppercase', color: '#283c63' }}>
              creating of collection new objet tag
            </h3>
        }
        optionscollectionitem={{
          labelButtonDelete:"remove",
          classNameClassificationItem:["border","border-1","border-white","mb-3","mt-2"],
          labelButtonAdd: 'Add',
          nameFieldOptions: {
            labelTextField: "Name",
            classNameLabelTextField:["form-label","text-warning","fw-bold"]
          },
          optionsCheckbox:{
            labelCheckbox: "Enabled",
            classNameLabel:["text-warning","form-check-label","fw-bolder"]
          }
        }}
          context_options={{
          urlRoute: "/api/admin.sonata.classification/context/list",
          nameSelect: 'context',
          labelSelect:'Context'
        }}
      />
      <hr /><br />
      <SelectContext
        nameSelect='context[name]'
        labelSelect='Context'
        urlRoute='/api/admin.sonata.classification/context/list'
        baseUrl='http://127.0.0.1:8001'
      />
      <hr /><br />
      <SelectCategory
        nameSelect='category[name]'
        labelSelect='Category'
        urlRoute='/api/admin.sonata.classification/category/list'
        baseUrl='http://127.0.0.1:8001'
      />
       <hr /><br />
      <SelectTag
        nameSelect='tag[name]'
        labelSelect='Tag'
        urlRoute='/api/admin.sonata.classification/tag/list'
        baseUrl='http://127.0.0.1:8001'
      />
    </>
  )
}

export default App
