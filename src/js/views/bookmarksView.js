import View from './View';
import previewView from './previewView';
/** Parcel needs that we import icons and images like this in order to bundle them properly */
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2. Assets like imgs, vids, etc need that url: prefix

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
  _message = '';


  addHandlerRender(handler){
    window.addEventListener('load', handler)
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
