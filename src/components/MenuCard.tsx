import { Plus } from "lucide-react";
import type { MenuItem } from "../data/menu";

type MenuCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem, optionName?: string, price?: number) => void;
};

export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div className="menu-card">
      <div className="menu-card-content">
        <div>
          <h3>{item.name}</h3>

          {item.options ? (
            <div className="menu-options">
              {item.options.map((option) => (
                <div className="menu-option" key={option.name}>
                  <div>
                    <span>{option.name}</span>
                    <strong>
                      ₦{option.price.toLocaleString()}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      onAdd(item, option.name, option.price)
                    }
                  >
                    <Plus size={17} />
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="single-price">
              <strong>₦{item.price?.toLocaleString()}</strong>

              <button
                onClick={() =>
                  onAdd(item, undefined, item.price)
                }
              >
                <Plus size={17} />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}