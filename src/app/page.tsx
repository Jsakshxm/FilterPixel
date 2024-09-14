import { ImageProvider } from './utils/ImageContext';
import { HomePageComponent } from '../components/home-page';
import { ImageEditorComponent } from '../components/image-editor';

function App() {
  return (
    <ImageProvider>
      <HomePageComponent />
      <ImageEditorComponent />
    </ImageProvider>
  );
}

export default App;
