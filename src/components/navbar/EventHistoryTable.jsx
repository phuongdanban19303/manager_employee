import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

const EventHistoryTable = ({ type, onEdit }) => {
  const { salaryHistory, promotionHistory, proposalHistory, loading } =
    useSelector((state) => state.event);

  const history =
    type === "salary"
      ? salaryHistory
      : type === "promotion"
        ? promotionHistory
        : proposalHistory;

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const canEdit = (status) => ["DRAFT", "UPDATE"].includes(status);

  if (loading)
    return (
      <div className="py-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">
        Đang tải lịch sử...
      </div>
    );
  if (!history || history.length === 0)
    return (
      <div className="py-20 text-center text-slate-300 font-bold italic uppercase tracking-widest text-[10px]">
        Chưa có dữ liệu diễn biến ghi nhận
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            {type === "salary" && (
              <>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Lần thứ
                </th>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Bậc lương
                </th>
              </>
            )}
            {type === "promotion" && (
              <>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Chức vụ mới
                </th>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Chức vụ cũ
                </th>
              </>
            )}
            {type === "proposal" && (
              <>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nội dung
                </th>
              </>
            )}
            <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              Ngày trình
            </th>
            <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              Trạng thái
            </th>
            <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {history.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/50 transition-all group"
            >
              {type === "salary" && (
                <>
                  <td className="px-12 py-6 font-black text-slate-800">
                    #{item.times}
                  </td>
                  <td className="px-12 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-slate-400 line-through text-[10px] font-bold">
                        {item.oldLevel}
                      </span>
                      <span className="text-blue-600 font-black text-xs">
                        → {item.newLevel}
                      </span>
                    </div>
                  </td>
                </>
              )}
              {type === "promotion" && (
                <>
                  <td className="px-12 py-6 font-black text-blue-600 text-xs">
                    {item.newPosition}
                  </td>
                  <td className="px-12 py-6 text-slate-400 font-bold text-[10px]">
                    {item.oldPosition}
                  </td>
                </>
              )}
              {type === "proposal" && (
                <>
                  <td className="px-12 py-6">
                    <p className="font-black text-slate-800 text-xs">
                      {item.content}
                    </p>
                  </td>
                </>
              )}
              <td className="px-12 py-6 text-center text-[11px] font-bold text-slate-400">
                {formatDate(item.submitDate || item.createdAt)}
              </td>
              <td className="px-12 py-6 text-center">
                <span
                  className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${
                    ["APPROVED", "DA_DUYET"].includes(item.status)
                      ? "bg-green-100 text-green-700"
                      : ["PENDING", "CHO_DUYET"].includes(item.status)
                        ? "bg-amber-100 text-amber-700"
                        : ["REJECTED", "TU_CHOI"].includes(item.status)
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-12 py-6 text-right">
                {canEdit(item.status) ? (
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[9px] font-black uppercase border border-amber-100 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    {console.log("day", item)}
                    <FaEdit /> Sửa nội dung
                  </button>
                ) : (
                  <span className="text-[9px] font-bold text-slate-300 italic uppercase">
                    Không thể sửa
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventHistoryTable;
