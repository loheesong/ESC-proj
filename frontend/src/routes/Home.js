import SearchDestForm from '../components/SearchForm/SearchDestForm';
import Deco from "../components/Deco";
import ImageGrid from '../components/ImageGrid/ImageGrid';
import Footer from '../components/Footer/Footer';

/** Page: Displays the home page of the app
 */
function Home() {
    return (
        <div className="App">
            <SearchDestForm></SearchDestForm>
            <div className='p-5'>
                <Deco />
            </div>
            <ImageGrid/>
            <Footer/>
        </div>
    );
}

export default Home