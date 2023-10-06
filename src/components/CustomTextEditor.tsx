import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { ActionIcon, Group, Menu } from "@mantine/core";
import { IconSettings, IconSignature } from "@tabler/icons";
import { useAppSelector } from "../redux/store";
import { useState } from "react";
import SignatureModal from "../modals/SignatureModal";
import { ISignatureResponse } from "../interfaces/signatures/ISignatureResponse";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CustomTextEditorProps = {
  onUpdate: (content: string) => void;
  content: string;
  isSignature?: boolean;
  onSignatureClick?: (s: ISignatureResponse) => void;
  selectedSignature?: string;
};

export default function CustomTextEditor({
  onUpdate,
  content,
  isSignature,
  onSignatureClick,
  selectedSignature,
}: CustomTextEditorProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { signatures, loading: gettingSignatures } = useAppSelector((state) => state.signatures);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Highlight,
        TextStyle,
        Color,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder: "Compose your message" }),
      ],
      onUpdate: (e) => {
        const content = e.editor.getHTML();
        onUpdate(content);
      },
      content: content,
    },
    [selectedSignature],
  );

  const [showSigModal, setShowSigModal] = useState(false);

  return (
    <div>
      <RichTextEditor editor={editor} w="100%">
        <RichTextEditor.Content mih={300} placeholder="Compose Email" />

        <div
          style={{ marginLeft: "16px" }}
          dangerouslySetInnerHTML={{ __html: selectedSignature ?? "" }}
        ></div>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Highlight />
            <RichTextEditor.ColorPicker
              colors={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          {!isSignature && (
            <>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </>
          )}
          {!isSignature && (
            <Group position="right" m="md">
              <Menu>
                <Menu.Target>
                  <ActionIcon loading={gettingSignatures} variant="light" title="Add Signature">
                    <IconSignature size="1em" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {signatures.length <= 0 && (
                    <Menu.Item onClick={() => setShowSigModal(true)}>
                      {t("noSignatureAdded")}, {t("pleaseAddOne")}.
                    </Menu.Item>
                  )}
                  {signatures.map((s) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          onSignatureClick && onSignatureClick(s);
                        }}
                        key={s.id}
                      >
                        {s.name}
                      </Menu.Item>
                    );
                  })}

                  <Menu.Divider />
                  <Menu.Item
                    onClick={() => navigate("/account/settings/signatures")}
                    icon={<IconSettings size="1em" />}
                  >
                    {t("manageSignatures")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </RichTextEditor.Toolbar>
      </RichTextEditor>

      {!isSignature && (
        <SignatureModal opened={showSigModal} onClose={() => setShowSigModal(false)} />
      )}
    </div>
  );
}
