import { useMemo, useRef } from "react";
import { Editor, EditorContent, EditorEvents, useEditor } from '@tiptap/react'

type UseRichTextEditorProps = {
    onCreate: (editor: Editor) => void
    onDestroy: () => void
}

type UseRichTextEditorActions = {
    insertContentToCursor: (content: string) => void
}

export function useRichTextEditor(): [UseRichTextEditorProps, UseRichTextEditorActions] {
    const editorRef = useRef<Editor | null>(null)

    const props = useMemo(() => {
        return {
            onCreate: (editor: Editor) => {
                editorRef.current = editor
            },
            onDestroy: () => {
                editorRef.current = null
            },
        }
    }, [])

    const actions = useMemo(() => {
        return {
            insertContentToCursor: (content: string) => {
                if (!editorRef.current) {
                    console.error('InsertContentAt');
                    return;
                }
                const pos = editorRef.current.state.selection.$anchor.pos
                console.log(pos)
                editorRef.current.commands.insertContentAt(pos, content)
            }
        }
    }, [])

    return [props, actions]
}