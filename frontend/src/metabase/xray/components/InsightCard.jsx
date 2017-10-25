import React, { Component } from 'react'
import { formatListOfItems, formatTimeWithUnit, inflect } from "metabase/lib/formatting";
import Icon from "metabase/components/Icon";
import { Link } from "react-router";
import Question from "metabase-lib/lib/Question";
import { TermWithDefinition } from "metabase/components/TermWithDefinition";

export class NormalRangeInsight extends Component {
    static insightType = "normal-range"
    static title = "Normal range of values"
    static icon = "insight"

    render() {
        const { min, max, features: { model } } = this.props
        return (
            <p>Normal value for { model.name } is between { min } and { max }.</p>
        )
    }
}

export class GapsInsight extends Component {
    static insightType = "gaps"
    static title = "Gaps in the data"
    static icon = "insight"

    render() {
        const { mode, quality, filter, features: { table } } = this.props

        const viewAllRowsUrl = table && Question.create()
            .query()
            // imitate the required hydrated metadata format
            .setTable({ ...table, database: { id: table.db_id }})
            .addFilter(filter)
            .question()
            .getUrl()

        // construct the question with filter
        return (
            <p>
                You have { quality } { mode } values in your data.
                <span> </span>
                { table && <span><Link to={viewAllRowsUrl}>View all rows</Link> with { mode } value.</span> }
            </p>
        )
    }
}

const noisinessDefinition = "Noisy data is highly variable jumping all over the place with changes carrying relatively little information."
const noisinessLink = "https://en.wikipedia.org/wiki/Noisy_data"

export class NoisinessInsight extends Component {
    static insightType = "noisiness"
    static title = "Noisy data"
    static icon = "insight"

    render() {
        const { quality, "recommended-resolution": resolution } = this.props

        return (
            <p>
                Your data is { quality }
                <span> </span>
                <TermWithDefinition definition={noisinessDefinition} link={noisinessLink}>
                    noisy
                </TermWithDefinition>.
                Perhaps try smoothing it or choose a { resolution } resolution.
            </p>
        )
    }
}

const autocorrelationDefinition = "Measure of how much (changes in) previous values predict future values."
const autocorrelationLink = "https://en.wikipedia.org/wiki/Autocorrelation"

export class AutocorrelationInsight extends Component {
    static insightType = "autocorrelation"
    static title = "Autocorrelation"
    static icon = "insight"

    render() {
        const { quality, lag } = this.props

        return (
            <p>
                Your data has a { quality }
                <span> </span>
                <TermWithDefinition definition={autocorrelationDefinition} link={autocorrelationLink}>
                    autocorrelation
            </TermWithDefinition>
		at lag { lag }.
            </p>
        )
    }
}

const variationTrendDefinition = "How variance in your data is changing over time."
const varianceLink = "https://en.wikipedia.org/wiki/Variance"

export class VariationTrendInsight extends Component {
    static insightType = "variation-trend"
    static title = "Variation trend"
    static icon = "insight"

    render() {
        const { mode } = this.props

        return (
            <p>
                The <TermWithDefinition definition={variationTrendDefinition} link={varianceLink}>
                    range of variation
            </TermWithDefinition>
		is { mode }.
            </p>
        )
    }
}
/*
export class RegimeChangeInsight extends Component {
    static insightType = "regime-change"
    static title = "Regime change"
    static icon = "insight"

    getTextForBreak = ({ from, to, mode, shape }) => {
        let { resolution } = this.props
        resolution = resolution || "year"

        if (from === "beginning") return `${mode} ${shape} period until ${formatTimeWithUnit(to, resolution)}`
        if (to === "now") return `${mode} ${shape} period from ${formatTimeWithUnit(from, resolution)} until now`
        return `${mode} ${shape} period from ${formatTimeWithUnit(from, resolution)} until now`
    }

    render() {
        let { breaks } = this.props

        return (
            <p>
                Your data can be split into { breaks.length } { inflect("stages", breaks.length) }:
                <span> </span>
                { formatListOfItems(breaks.map(this.getTextForBreak)) }.
            </p>
        )
    }
}
*/


const INSIGHT_COMPONENTS = [
    // numeric fields
    NormalRangeInsight,
    GapsInsight,
    // timeseries
    NoisinessInsight,
    VariationTrendInsight,
    AutocorrelationInsight,
    // RegimeChangeInsight
]

export const InsightCard = ({type, props, features}) => {
    const Insight = INSIGHT_COMPONENTS.find((component) => component.insightType === type)

    return (
        <div className="flex-full" style={{ width: "22em" }}>
            <div className="bg-white bordered rounded shadowed full-height p3">
                <header className="flex align-center">
                    <Icon name={Insight.icon} size={24} className="mr1" style={{ color: '#93a1ab' }} />
                    <span className="text-bold text-uppercase">{Insight.title}</span>
                </header>
                <div style={{ lineHeight: '1.4em' }}>
                    <Insight {...props} features={features} />
                </div>
            </div>
        </div>
    )
}
