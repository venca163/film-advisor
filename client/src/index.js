const userIdPrefix = 'filmAdvisor_'

const getLSuserIdName = () => userIdPrefix + 'userId'


const showFilmView = () => {
    class FilmView extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}

            this.nextFilm = this.nextFilm.bind(this)
        }

        nextFilm (event) {  
            const films = [{name: 'HP', genre: 'horror', score: 5}, {name: 'HP', genre: 'horror', score: 4}]
            if(films.length === 0) {
                console.log('Nenasli jsme pro vas zadne filmicky')
            } else {
                this.setState({
                    filmName: films[0].name,
                    filmGenre: films[0].genre,
                    filmScore: films[0].score,
                })
            }
            event.preventDefault()
        }
        

        render () {
            return (
                <div>
                    <button onClick={this.nextFilm}>Dalsi film</button>
                    <p>{this.state.filmName}</p>
                    <p>{this.state.filmGenre}</p>
                    <p>{this.state.filmScore}</p>
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
                    loadFilms()
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
