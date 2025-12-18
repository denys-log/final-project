import classNames from "classnames";
import styles from "./vocabulary-list-header.module.css";
import {
  FaCheck,
  FaCheckSquare,
  FaFilter,
  FaRegSquare,
  FaSort,
} from "react-icons/fa";
import { useState } from "react";
import { FREQUENCY_TIERS } from "@/content/hooks/use-word-frequency";

export function VocabularyListHeader({
  filterValue,
  searchValue,
  onChangeFilter,
  onChangeSearchValue,
  sortValue,
  onChangeSortValue,
}: {
  filterValue: string[];
  searchValue: string;
  sortValue: "alphabetical" | "date" | undefined;
  onChangeFilter: (value: string) => void;
  onChangeSearchValue: (value: string) => void;
  onChangeSortValue: (value: "alphabetical" | "date") => void;
}) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    setIsSortDropdownOpen(false);
  };

  const handleSortDropdownToggle = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className={styles.header}>
      <input
        type="text"
        placeholder="Шукати слово..."
        value={searchValue}
        onChange={(e) => onChangeSearchValue(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.filterBtnWrapper}>
        <button
          type="button"
          className={classNames(styles.btn, styles.sortBtn)}
          onClick={handleSortDropdownToggle}
        >
          <FaSort />
        </button>
        {isSortDropdownOpen && (
          <div className={styles.filterDropdown}>
            <div className={styles.sortDropdownItem}>
              <button
                type="button"
                className={classNames(styles.sortItemBtn, {
                  [styles.active]: sortValue === "alphabetical",
                })}
                onClick={() => onChangeSortValue("alphabetical")}
              >
                За алфавітом
                {sortValue === "alphabetical" ? (
                  <div className={styles.sortDropdownItemIcon}>
                    <FaCheck />
                  </div>
                ) : null}
              </button>
            </div>
            <div className={styles.sortDropdownItem}>
              <button
                type="button"
                className={classNames(styles.sortItemBtn, {
                  [styles.active]: sortValue === "date",
                })}
                onClick={() => onChangeSortValue("date")}
              >
                За датою додавання
                {sortValue === "date" ? (
                  <div className={styles.sortDropdownItemIcon}>
                    <FaCheck />
                  </div>
                ) : null}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.filterBtnWrapper}>
        <button
          type="button"
          className={styles.btn}
          onClick={handleFilterDropdownToggle}
        >
          <FaFilter />
        </button>
        {isFilterDropdownOpen && (
          <div className={styles.filterDropdown}>
            {Object.values(FREQUENCY_TIERS).map((tier) => (
              <div id={tier.name} className={styles.filterDropdownItem}>
                <div className={styles.filterDropdownItemIcon}>
                  {tier.color}
                </div>
                <div className={styles.filterDropdownItemLabel}>
                  {tier.description}
                </div>
                <button
                  type="button"
                  className={styles.checkboxBtn}
                  onClick={() => onChangeFilter(tier.nameEn)}
                >
                  {filterValue.includes(tier.nameEn) ? (
                    <FaCheckSquare />
                  ) : (
                    <FaRegSquare />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
