const userIdPrefix = 'filmAdvisor_'

const getLSuserIdName = () => userIdPrefix + 'userId'


const showFilmView = () => {
    class FilmView extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}

            this.loadFilms = this.loadFilms.bind(this)
        }

        getFilms () {
            fetch ("/api/get-movies")
                .then (res => res.text())
                .then (res => {
                    try {
                        let films = JSON.parse(res)
                        this.setState ({ apiResponse: films })
                    } catch (err) {throw err}
                } 
            )
        }

        componentWillMount () {
            this.getFilms()
        }

        loadFilms (event) {  
            let films = this.state.apiResponse
            if(films.length === 0) {
                const noFilmsFound = 'Nenasli jsme pro vas zadne filmicky'
                this.setState({error: noFilmsFound})
            } else {
                this.setState({films: films})
            }
            event.preventDefault()
        }
        

        render () {
            if (this.state.error) {
                return <p>{this.state.error}</p>
            } 
            if (!this.state.films) {
                return <button className="next_film" onClick={this.loadFilms}>Dalsi film</button>
            } 
            if (!localStorage.getItem('lowestUnseenFilmId')) {
                localStorage.setItem('lowestUnseenFilmId', 3)
            }
            let lowestUnseenFilmId = parseInt(localStorage.getItem('lowestUnseenFilmId'))
            const top3Films = this.state.films.slice(lowestUnseenFilmId - 3, lowestUnseenFilmId)
            localStorage.setItem('lowestUnseenFilmId', lowestUnseenFilmId + 3)
            
            if(top3Films.length === 0) {
                localStorage.setItem('lowestUnseenFilmId', 3)
                return (
                    <div className='wrapper'>
                        <p>To je prozatim vse</p>
                        <button className="next_film" onClick={this.loadFilms}>Zacit znovu</button>
                    </div>
                )
            }
            const films = top3Films.map((film, key) =>
            <ul key={key}>
                    <li>Název: {film.name}</li>
                    <li>Žánry: {film.genres}</li>
                    <li>Hodnocení: {film.score}</li>
                </ul>
            )
            
            return (
                <div className='wrapper'>
                    <button className="next_film" onClick={this.loadFilms}>Dalsi film</button>
                    <div className='film_wrapper'> {films} </div>
                </div>
            )
        }
    }

    ReactDOM.render(
        <FilmView />,
        document.getElementById('filmView')
    )
}

if (localStorage.getItem(getLSuserIdName()) === null) {
    class NameForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = {value: ''}

            this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleChange(event) {
            this.setState({value: event.target.value})
        }
    
        handleSubmit(event) {
            let userId
            let userIdErr

            try {
                let url = this.state.value
                let userId = url.split("/")[url.split("/").length - 1].split('-')[0]
                if(userId === "") {
                    userId = url.split("/")[url.split("/").length - 2].split('-')[0]
                }

                if(isNaN(userId) || userId === undefined || userId === null || userId === "") {
                    userIdErr = 'Špatně zadaná URL'
                    this.setState({userIdErr: userIdErr}) 
                } else {
                    localStorage.setItem(getLSuserIdName(), userId)
                    this.setState({
                        userId: userId,
                        userIdErr: null,
                    })
                    this.setState({showResults: true})
                    showFilmView()
                }

            } catch (err) {
                userIdErr = 'Špatně zadaná URL'
                this.setState({userIdErr: userIdErr})
            }
            
            event.preventDefault();
        }
        

        render() {
            const stylee = this.state.showResults ? {display: 'none'} : {}
            return (
                <div style={stylee}>
                    <label>
                        Url:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <button onClick={this.handleSubmit}>Start</button>
                    <p>{this.state.userId}</p>
                    <p>{this.state.userIdErr}</p>
                </div>
            );
        }
    }

    ReactDOM.render(
        <NameForm />,
        document.getElementById('loginForm')
    )

} else {
    showFilmView()
}
