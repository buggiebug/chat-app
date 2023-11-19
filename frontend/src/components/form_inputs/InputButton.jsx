import {RxReload} from 'react-icons/rx';

export default function InputButton({name, restClass, loading,onClickMethod}) {
  return (
    <button type={"submit"} className={`border h-8 rounded-sm outline-none px-3 py-1 flex justify-around items-center peer ${restClass}`} onClick={onClickMethod}>
      {loading ? <RxReload className='animate-spin'/>: name }
    </button>
  );
}
