import { getCookie } from 'cookies-next';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import config from 'config';

async function getUserId(_auth: any) {
    const url = `${config.baseApiUrl}/users`;
    const headers = {
      'Authorization': `Bearer ${_auth.token}`,
      'accept': '*/*',
    };
  
    try {
      const response = await fetch(url, { headers, method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const {data} = await response.json();
        return data?.id;
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
}
  

const useAddNote = (handleClose: Function) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useSelector(selectCurrentUser);

    const addNote = async ( note: string): Promise<any> => {
        
        setLoading(true);
        setError(null);

        const userId = await getUserId(auth);

       
        
        try {
            const response = await fetch(`${config.baseApiUrl}/microcredit/notes`, {
                body: JSON.stringify({
                    note,
                    userId,
                }),
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                    message: getCookie('MESSAGE').toString(),
                    signature: getCookie('SIGNATURE').toString()
                },
                method: 'POST'
            });


            const data = await response.json();

            console.log("Response: ", data);

            setLoading(false);
            handleClose();
            return data;
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
        }
    };

    return { addNote, error, loading };
};

export default useAddNote;
