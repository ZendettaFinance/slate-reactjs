import React,{useCallback, useState,Fragment} from "react";
import { createEditor, Transforms,Editor, Text,Element } from 'slate';
import { Slate, Editable, withReact} from 'slate-react'
import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/feather/bold";
import { italic } from "react-icons-kit/feather/italic";
import { code } from "react-icons-kit/feather/code";
import { list } from "react-icons-kit/feather/list";
import { underline} from "react-icons-kit/feather/underline";
import {alignLeft} from 'react-icons-kit/feather/alignLeft'
import {alignCenter} from 'react-icons-kit/feather/alignCenter'
import {alignRight} from 'react-icons-kit/feather/alignRight'
import {quoteSerifLeft} from 'react-icons-kit/iconic/quoteSerifLeft'
import {link} from 'react-icons-kit/feather/link'
import {camera} from 'react-icons-kit/feather/camera'
import {minus} from 'react-icons-kit/feather/minus'
import FormatToolbar from "./FormatToolbar";


const MainFontsApp = () => {
  
  const [editor] = useState(() => withReact(createEditor()),[]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
        case 'code':
            return <CodeElement {...props} />

        default :
            return <DefaultElement {...props} />
    }
  })
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
  <Fragment>
    <FormatToolbar>
        <button 
        onPointerDown={(e) => CustomEditor.toggleBoldMark(editor)}
        className="tooltip-icon-button">
            <Icon icon={bold} />
        </button>
        <button 
        onPointerDown={(e) => CustomEditor.toggleItalicMark(editor)}
        className="tooltip-icon-button">
            <Icon icon={italic} />
        </button>
        <button 
        onPointerDown={(e) => CustomEditor.toggleCodeBlock(editor)} 
        className="tooltip-icon-button">
            <Icon icon={code} />
        </button>
        <button className="tooltip-icon-button">
            <Icon icon={list} />
        </button>
        <button
            onPointerDown={(e) => CustomEditor.toggleStrikethrough(editor)} 
            className="tooltip-icon-button">
            <Icon icon={minus} />
        </button>
        <button
            onPointerDown={(e) => CustomEditor.toggleUnderline(editor)} 
            className="tooltip-icon-button">
            <Icon icon={underline} />
        </button>
        <button className="tooltip-icon-button">
            <Icon icon={alignLeft} />
        </button>
        <button 
          onPointerDown={(e) => CustomEditor.toggleAlignCenter(editor)} 
          className="tooltip-icon-button">
            <Icon icon={alignCenter} />
        </button>
        <button className="tooltip-icon-button">
            <Icon icon={alignRight} />
        </button>
        <button 
            onPointerDown={(e) => CustomEditor.toggleBlockQuote(editor)}
            className="tooltip-icon-button">
            <Icon icon={quoteSerifLeft} />
        </button>
        <button className="tooltip-icon-button">
            <Icon icon={link} />
        </button>
        <button 
            onPointerDown={(e) => CustomEditor.toggleImage(editor)}
            className="tooltip-icon-button">
            <Icon icon={camera} />
        </button>
    </FormatToolbar>
        <Slate editor={editor} value={initialValue} >
            <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={ event => {
                    if (!event.ctrlKey) {
                    return
                }

                    switch (event.key) {
                    case '`': {
                        event.preventDefault()
                         CustomEditor.toggleCodeBlock(editor)
                         break
                        }
                    case 'b': {
                        event.preventDefault()
                        CustomEditor.toggleBoldMark(editor)
                    break
                    }
                    case 'i': {
                        event.preventDefault()
                        CustomEditor.toggleItalicMark(editor)
                    break
                    }
                    case 'c': {
                        event.preventDefault()
                        CustomEditor.toggleStrikethrough(editor)
                    break
                    }
                    case 'u': {
                        event.preventDefault()
                        CustomEditor.toggleUnderline(editor)
                    break
                    }
                }
                }}
            />
        </Slate>
  </Fragment>

  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
  {
    type: 'link',
    url : 'https://www.google.com/',
    children: [{text: 'hyperlink'}],
  }
]

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}



const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}


const Leaf = ({ leaf, children, attributes }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }
    if (leaf.blockquote) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const CustomEditor = {
    isBoldMarkActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.bold === true,
        universal: true,
      })

      return !!match
    },

    isCodeBlockActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'code',
      })

      return !!match
    },
    isItalicMarkActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.italic === true,
        universal: true,
      })

      return !!match
    },

    toggleBoldMark(editor) {
      const isActive = CustomEditor.isBoldMarkActive(editor)
      Transforms.setNodes(
        editor,
        { bold: isActive ? null : true },
        { match: n => Text.isText(n), split: true }
      )
    },
    toggleItalicMark(editor) {
      const isActive = CustomEditor.isItalicMarkActive(editor)
      Transforms.setNodes(
        editor,
        { italic: isActive ? null : true },
        { match: n => Text.isText(n), split: true }
      );
    },
    toggleCodeBlock(editor) {
      const isActive = CustomEditor.isCodeBlockActive(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'code' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },
    toggleStrikethrough(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.strikethrough === true,
        universal: true
      });
      Transforms.setNodes(
        editor,
        { strikethrough: !!match ? null : true },
        { match: n => Text.isText(n), split: true }
      );
    },
      toggleUnderline(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.underline === true,
        universal: true
      });
      Transforms.setNodes(
        editor,
        { underline: !!match ? null : true },
        { match: n => Text.isText(n), split: true }
      );
    },

  
}



export default MainFontsApp;