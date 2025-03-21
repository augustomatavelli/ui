/* import React, { useState, useEffect, useRef } from "react";

const LocalEvento = ({ onEnviar }) => {
	const [nomeLocal, setNomeLocal] = useState("");
	const [endereco, setEndereco] = useState("");
	const [bairro, setBairro] = useState("");
	const [cep, setCep] = useState("");
	const [estado, setEstado] = useState("");
	const [cidade, setCidade] = useState("");
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [urlMaps, setUrlMaps] = useState("");

	const inputRef = useRef(null);
	const mapRef = useRef(null);
	const markerRef = useRef(null);

	useEffect(() => {
		const loadMap = () => {
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCb5Tr0h2K_FryJ2_3TmtsX3wgXYMNbIe4&libraries=places`; // Substitua YOUR_API_KEY
			script.defer = true;
			script.async = true;
			script.onload = () => {
				setTimeout(initMap, 100); //delay of 100 miliseconds.
			};
			document.head.appendChild(script);
		};

		if (window.google && window.google.maps) {
			initMap();
		} else {
			loadMap();
		}
	}, []);

	const initMap = () => {
		const defaultLocation = { lat: -20.4182467, lng: -49.95835779999999 };
		const map = new window.google.maps.Map(mapRef.current, {
			center: defaultLocation,
			zoom: 13,
		});
		const marker = new window.google.maps.Marker({
			map,
			position: defaultLocation,
		});
		markerRef.current = marker;

		const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
		autocomplete.bindTo("bounds", map);
		autocomplete.setFields(["address_components", "geometry", "name"]);

		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();
			if (!place.geometry) return;

			map.setCenter(place.geometry.location);
			map.setZoom(17);
			marker.setPosition(place.geometry.location);
			console.log(place);
			vincularDadosLocal(place);
		});
	};

	const vincularDadosLocal = (place) => {
		setLatitude(place.geometry.location.lat());
		setLongitude(place.geometry.location.lng());
		setNomeLocal(place.name || "");

		if (place.address_components) {
			const addressComponents = place.address_components.reduce((acc, { long_name, short_name, types }) => {
				types.forEach((type) => (acc[type] = { long_name, short_name }));
				return acc;
			}, {});

			setEndereco(addressComponents.route?.long_name || "");
			setBairro(addressComponents.sublocality?.long_name || "");
			setEstado(addressComponents.administrative_area_level_1?.short_name || "");
			setCidade(addressComponents.administrative_area_level_2?.long_name || "");
			setCep(addressComponents.postal_code?.long_name || "");
		}

		setUrlMaps(`https://www.google.com/maps/place/${nomeLocal}/@${latitude},${longitude},17z`);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onEnviar({ nomeLocal, endereco, bairro, cep, estado, cidade, latitude, longitude, urlMaps });
	};

	return (
		<div className="jumbotron text-left bg-light">
			<div className="row">
				<div className="col-12 text-center">
					<h3>Aonde o evento vai acontecer?</h3>
				</div>
				<div className="col-12 mb-2">
					<label className="labelpro">Busca Inteligente</label>
					<input ref={inputRef} type="text" className="form-control" placeholder="Nome do Local" required />
				</div>
				<div className="col-12 col-md-6">
					<div className="mb-1">
						<label className="labelpro">Apelido</label>
						<input type="text" value={nomeLocal} onChange={(e) => setNomeLocal(e.target.value)} className="form-control" />
					</div>
					<div className="mb-1">
						<label className="labelpro">Endereço</label>
						<input type="text" value={endereco} className="form-control" readOnly />
					</div>
					<div className="d-flex mb-1">
						<div>
							<label className="labelpro">Bairro</label>
							<input type="text" value={bairro} className="form-control" readOnly />
						</div>
						<div>
							<label className="labelpro">CEP</label>
							<input type="text" value={cep} className="form-control" readOnly />
						</div>
					</div>
					<div className="mb-1">
						<label className="labelpro">Cidade/Estado</label>
						<div className="input-group">
							<input type="text" value={cidade} className="form-control" readOnly />
							<input type="text" value={estado} className="form-control" readOnly />
						</div>
					</div>
				</div>
				<div className="col-12 col-md-6">
					<div id="map" ref={mapRef} style={{ width: "100%", height: "300px" }}></div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-6 text-left"></div>
				<div className="col-6 text-right">
					<button className="btn btn-success">CONTINUAR</button>
				</div>
			</div>
		</div>
	);
};

export default LocalEvento;
 */
