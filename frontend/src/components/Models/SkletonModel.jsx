import React from 'react'

const SkletonModel = () => {
    return (
        <div className={`py-2 px-3 my-0 flex items-center cursor-pointer bg-[#ffffff4f] mb-[1px]`} id="userGridSkleton">
          <div className="w-fit">
            <p className="w-[40px] h-[40px] rounded-full bg-[#f0ffff54]"></p>
          </div>
          <div className="mx-2 ml-3 flex items-center justify-between w-full pb-2">
            <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between w-full relative -top-1">
                <p className="font-medium w-[25%] h-[6px] bg-[#f0ffff54]"></p>
                <p className="text-sm w-[10%] h-[6px] bg-[#f0ffff54]"></p>
              </div>
              <div>
                <p className="text-sm relative top-3 w-[50%] h-[6px] bg-[#f0ffff54]"></p>
              </div>
            </div>
          </div>
        </div>
    )
}

export default SkletonModel