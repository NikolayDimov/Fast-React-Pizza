import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition(): Promise<GeolocationPosition> {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

export const fetchAddress = createAsyncThunk<
    { position: { latitude: number; longitude: number }; address: string },
    void,
    { rejectValue: string }
>("user/fetchAddress", async () => {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
});

export interface State {
    username: string;
    status: "idle" | "loading" | "error";
    position: {
        latitude: number;
        longitude: number;
    };
    address: string;
    error: string;
}

// export type Action = OpenAccountProps;

const initialState: State = {
    username: "",
    status: "idle",
    position: { latitude: 0, longitude: 0 },
    address: "",
    error: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateName(state: State, action) {
            state.username = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchAddress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.position = action.payload.position;
                state.address = action.payload.address;
                state.status = "idle";
            })
            .addCase(fetchAddress.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message ?? "Unknown error";
            }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
