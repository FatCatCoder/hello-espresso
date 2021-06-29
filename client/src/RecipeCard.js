import {Link} from 'react-router-dom';
import {useState } from 'react';

function RecipeCard({recipe, number}){
    const myDate = new Date(recipe.roastdate).toLocaleDateString();
    console.log(recipe.id)
    const [likes, setLikes] = useState(0);


    const fetchLikes = async () => {
        const res = await fetch('/recipes/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id" : recipe.id})
        })
        const data = await res.json()
        
        setLikes(data)
    }

    fetchLikes();


    return(
        <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="col h-100">
            <div className="card h-100 shadow">

            <div className="container-fluid shadow-sm mt-2 p-2">
                        <h5 className="card-title text-capitalize">{recipe.bean !== undefined ? recipe.bean: 'Bean'} - {recipe.roaster !== undefined ? recipe.roaster: 'Roaster'}</h5>
                        <h6 className="card-subtitle mb-2 text-muted text-capitalize">{recipe.region !== undefined ? recipe.region: 'Region'}</h6>
                    </div>
                <div className="card-body">
                    
                    <p className="container smaller-text card-text text-capitalize">Notes: <span className="text-muted">{recipe.tastingnotes !== undefined ? recipe.tastingnotes: 'Notes'}</span></p>
                    <p className="card-text"><small className="text-muted">Date Roasted: {myDate !== undefined ? myDate: 'Date'}</small></p>
                </div>
                <i class="bi bi-heart-fill text-danger border"> x {likes} </i>
            </div> 
        </div>
        </Link>
    )
}

export default RecipeCard;