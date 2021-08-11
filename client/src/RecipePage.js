import { useParams, useHistory } from "react-router";
import {useEffect, useState} from 'react';
import {globalStore} from './store';
import './RecipePage.scss';

function RecipePage(props){
    console.log(" RECIPE PAGE  RENDER")
    console.log(props.recipe)

    let {id} = useParams();
    let history = useHistory();

    // Auth
    const isValid = globalStore(state => state.checkValidToken); 
    const isLoggedIn = globalStore(state => state.isLoggedIn);
    const user_id = globalStore(state => state.getUserIdFromJWT);

    // Data
    const [liked, setLiked] = useState(false);
    const [recipe, setRecipe] = useState(props.recipe.find(obj => obj.id == id));
    var recipeUserId = recipe?.userId;

    


    // get initial isLiked from server
    const fetchLiked = async () => {
        const res = await fetch('/recipes/liked', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"recipe_id" : id, "user_id": user_id() })
        })
        const data = await res.json()
        
        setLiked(data.bool)
    }

    // toggle like on server and updates with json returned bool
    const bussinButton = async () => {
        const validity = await isValid();
        
        if(validity){
            const res = await fetch('/recipes/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"recipe_id" : id, "user_id": user_id() })
            })

            const data = await res.json()   
            setLiked(data.bool)
        }
            else{
                setBussinText({"text" : "Login to Like!", "click": () => history.push('/login')})
            }
    }
// like button text and onClick action as an object
const [bussinText, setBussinText] = useState({"text":"Bussin' Button", "click": bussinButton});
    
// Effects
    // load from state or fetch data
    useEffect(() => {
        const abortController = new AbortController();
        let ignore = false;

        const fetchRecipe = async () => {
            const res = await fetch(`/recipes/${id}`)
            const data = await res.json()
            recipeUserId = data[0].userId
            setRecipe(data[0]);
        }
        // no props, fetch from server
        if (props.recipe.length === 0) {
            fetchRecipe();
        }

        return () => {
            ignore = true;
            abortController.abort();
        }; 
    }, [])


    // checks if is liked
    useEffect(() => {
        fetchLiked();
    }, []);
    
    
    return(
        <div className="container text-center mb-3">
            <div className="my-2">
                <h1 className="display-3 text-capitalize">{ recipe?.bean ?? 'Bean'  } - {recipe?.roaster ?? 'Roaster'}</h1>
                <h2 className="text-muted text-capitalize">Region: {recipe?.region}</h2>
                
            </div>
            
            
            <div className="container col-xl-4">
                <div className="row">
                    <p className="text-muted col-6 fs-6">Roast: { recipe?.roast}</p>
                    <p className="text-muted col-6 fs-6">Process: { recipe?.process}</p>
                </div>

                <div className="row">
                    <p className="text-muted col-6 fs-6">Roasted: {new Date(recipe?.roastdate).toLocaleDateString()}</p>
                    <p className="text-muted col-6 fs-6">Posted: {new Date(recipe?.postdate).toLocaleDateString()}</p>
                </div>
            </div>

            <button type="button" class={`btn btn-outline-danger ${liked === true ? 'active': ''}`} onClick={() => bussinText.click()} aria-pressed="false">
                <i class="bi bi-heart-fill">{bussinText.text}</i>     
            </button> 
            

            <div className="container col-xl-8 my-4">
                <div className="row bg-light border mx-auto justify-content-center">
                    <div className="col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 my-3">
                        <p className="bg-white p-2 py-2 shadow">Dose: { recipe?.dose }g</p>
                        <p className="bg-white p-2 py-2 shadow">Yield: { recipe?.yield }ml</p>
                    </div>
                    <div className="col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 my-3">
                        <p className="bg-white p-2 py-2 shadow">Time: { recipe?.time }s</p>
                        <p className="bg-white p-2 py-2 shadow">Grind: <span className="p-1">#{ recipe?.grind }</span></p>
                    </div>
                    <p><span className="text-primary text-capitalize">Tasting Notes:</span> { recipe?.tastingnotes }</p>
                </div>
            </div>
            

            <div className="container col-xl-8 mx-auto" id="infoBlock">
                <div className="row">
                    <div className="card p-0 col-6 col-md-6"><h6 className="card-header">Machine </h6> <p className="card-body text-capitalize">{ recipe?.machine }</p></div>
                    <div className="card p-0 col-6 col-md-6"><h6 className="card-header">Grinder </h6> <p className="card-body text-capitalize">{ recipe?.grinder }</p></div>                  
                </div>

                <div className="row">
                    <div className="card p-0 col-12 col-md-12"><h6 className="card-header">Notes </h6> <p className="card-body">{ recipe?.notes }</p></div>
                </div>
            </div>

        {(recipe !== null && user_id === recipe?.userId) && isLoggedIn? 
        <button className="btn btn-danger mt-2">
            <span class="main-text">Delete Recipe</span>
            <span class="hover-text">Are You Sure?</span>
            </button>
        : null}
        </div>
    )
}

export default RecipePage;