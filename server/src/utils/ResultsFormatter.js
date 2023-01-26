import { QUIZ_RESULTS_LIMIT } from "../configs/general.config.js";

export default class ResultsFormatter {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sortByDate() {
    this.query = this.query.sort({ createdAt: -1 });
    return this;
  }

  search() {
    const { search = "" } = this.queryString;
    this.query = this.query.find({ title: new RegExp(search, "i") });
    return this;
  }

  filter() {
    const { category = "" } = this.queryString;
    this.query = this.query.find({
      category: new RegExp(category, "i"),
    });
    return this;
  }

  onlyActive() {
    this.query = this.query.find({ status: "ACTIVE" });
    return this;
  }

  paginate() {
    const { page = 1 } = this.queryString;
    const index = (Number(page) - 1) * QUIZ_RESULTS_LIMIT;
    this.query = this.query.skip(index || 0).limit(QUIZ_RESULTS_LIMIT);
    return this;
  }

  exec = async function (res) {
    const { page = 1 } = this.queryString;
    const total = await this.query.clone().count();
    const results = await this.query.populate("createdBy", "avatar");
    const pages = Math.ceil(total / QUIZ_RESULTS_LIMIT);

    res.json({
      data: results,
      count: total,
      perPage: QUIZ_RESULTS_LIMIT,
      numPages: pages,
      currentPage: Number(page),
      currentPageCount: results.length,
    });
  };
}
