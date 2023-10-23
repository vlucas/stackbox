import { createStackboxEditor, ReactEditor } from "./stackbox/Editor";
import "./styles.css";

const editor = createStackboxEditor();

export default function App() {
  return (
    <div id="test-react-editor">
      <h1>Editor Test</h1>
      <ReactEditor editor={editor} />
    </div>
  );
}
