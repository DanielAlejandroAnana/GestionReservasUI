import React, { Component } from "react";
import axios from "axios";

class ReservaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicios: [],
      reservas: [],
      nombreCliente: "",
      servicioSeleccionado: "",
      fecha: "",
      hora: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/reservas/servicios")
      .then((response) => this.setState({ servicios: response.data }))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:5000/api/reservas/reservas")
      .then((response) => this.setState({ reservas: response.data }))
      .catch((error) => console.error(error));
  }
  
  handleReserva = () => {
    const { nombreCliente, servicioSeleccionado, fecha, hora } = this.state;
  
    if (!nombreCliente || !servicioSeleccionado || !fecha || !hora) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const nuevaReserva = {
      servicio: servicioSeleccionado,
      fecha,
      hora,
      cliente: {
        nombre: nombreCliente,
      },
    };
  
    axios.post("http://localhost:5000/api/reservas/reservar", nuevaReserva)
      .then((response) => {
        alert(response.data.mensaje);
        this.setState((prevState) => ({
          reservas: [...prevState.reservas, nuevaReserva],
        }));
      })
      .catch((error) => alert(error.response.data));
  };

  render() {
    const { servicios, reservas, nombreCliente, servicioSeleccionado, fecha, hora } = this.state;

    return (
      <div>
        <h1>Gestión de Reservas</h1>
        <div>
          <h2>Crear Reserva</h2>
          <input
            type="text"
            placeholder="Nombre del Cliente"
            value={nombreCliente}
            onChange={(e) => this.setState({ nombreCliente: e.target.value })}
          />
          <select
            value={servicioSeleccionado}
            onChange={(e) => this.setState({ servicioSeleccionado: e.target.value })}
          >
            <option value="">Seleccionar Servicio</option>
            {servicios.map((servicio, index) => (
              <option key={index} value={servicio}>
                {servicio}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fecha}
            onChange={(e) => this.setState({ fecha: e.target.value })}
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => this.setState({ hora: e.target.value })}
          />
          <button onClick={this.handleReserva}>Reservar</button>
        </div>
        <div>
          <h2>Listado de Reservas</h2>
          <ul>
            {reservas.map((reserva, index) => (
              <li key={index}>
                {reserva.nombreCliente} - {reserva.servicio} - {new Date(reserva.fecha).toLocaleDateString()} {reserva.hora}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ReservaComponent;