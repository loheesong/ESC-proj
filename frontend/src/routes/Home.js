import SearchDestForm from '../components/SearchForm/SearchDestForm';
import Deco from "../components/Deco";
/** Page: Displays the home page of the app
 */
function Home() {
    return (
        <div className="App">
        <p>This is the home page</p>
        <SearchDestForm></SearchDestForm>
        <div className='p-5'>
            <Deco />
        </div>
        </div>
    );
}

export default Home